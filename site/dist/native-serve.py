"""Local sample server for native tensor FXBX packages (fxbX 0.9.5).

Uses the same ExecutionFXB/sample path as `fxbx run MODEL --sample`.
This is a tensor API: it does not add tokenization or image preprocessing.
"""
from http.server import BaseHTTPRequestHandler, HTTPServer
import argparse
import json
from pathlib import Path


def make_server(predict, port):
    class Handler(BaseHTTPRequestHandler):
        def send(self, status, result):
            data = json.dumps(result, ensure_ascii=False).encode()
            self.send_response(status)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(data)))
            self.end_headers()
            self.wfile.write(data)

        def do_POST(self):
            if self.path != '/predict':
                return self.send(404, {'error': 'Unknown endpoint'})
            try:
                n = int(self.headers.get('Content-Length', '0'))
                if not 0 < n <= 64 * 1024 * 1024:
                    raise ValueError('Request must be 1..64 MiB')
                body = json.loads(self.rfile.read(n))
                if not isinstance(body, dict):
                    raise ValueError('Expected a JSON object')
                if body != {'sample': True} and (set(body) != {'inputs'} or not isinstance(body['inputs'], dict)):
                    raise ValueError('Use {"sample":true} or {"inputs":{tensor_name:array}}')
                result = predict(body)
            except Exception as exc:
                return self.send(400, {'error': str(exc)})
            self.send(200, result)

    return HTTPServer(('127.0.0.1', port), Handler)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('model')
    parser.add_argument('--port', type=int, default=8000)
    args = parser.parse_args()
    import torch
    from safetensors.torch import load_file, save_file
    from fxbex.hub import resolve_package
    from fxbex.execution_fxb import ExecutionFXB
    package = str(resolve_package(args.model))
    sample_path = Path(package + '.sample.safetensors')
    if not sample_path.is_file():
        raise SystemExit('Sample missing. Run: fxbx fetch ' + args.model + ' --refresh')
    sample = load_file(str(sample_path))
    with ExecutionFXB(package) as model:
        entry = model.plan['entries']['forward']
        names = entry['inputs']
        if not all(n in sample for n in names):
            if len(names) == 1 and 'image0' in sample:
                sample = {names[0]: sample['image0']}
            else:
                raise ValueError('Sample tensor names differ from plan')

        def predict(body):
            if body == {'sample': True}:
                tensors = {n: sample[n] for n in names}
            else:
                if set(body['inputs']) != set(names):
                    raise ValueError('Required tensor names: ' + ', '.join(names))
                tensors = {n: torch.tensor(body['inputs'][n], dtype=sample[n].dtype) for n in names}
            outputs = model.predict(tuple(tensors[n] for n in names))
            values = {n: t.detach().cpu().contiguous().clone() for n, t in zip(entry['outputs'], outputs, strict=True)}
            destination = Path('outputs.safetensors').resolve()
            save_file(values, str(destination))
            return {'result_file': str(destination), 'outputs': {n: {
                'shape': list(t.shape), 'dtype': str(t.dtype),
                'first_values': t.flatten()[:8].float().tolist(),
            } for n, t in values.items()}}

        with make_server(predict, args.port) as server:
            print('Tensor sample API ready: http://127.0.0.1:' + str(server.server_port), flush=True)
            try:
                server.serve_forever()
            except KeyboardInterrupt:
                pass


if __name__ == '__main__':
    main()
