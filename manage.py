import os
import sys
from jinja2 import Environment, FileSystemLoader

sys.path.append(os.path.dirname(os.path.abspath(__file__)) + '/..')


def get_templates():
    os.chdir('templates')
    templates = _get_templates()
    os.chdir('..')
    return templates


def _get_templates(directory=''):
    templates = []
    names = os.listdir(directory or '.')
    path = '%s/' % directory if directory else ''
    for name in names:
        name = '%s%s' % (path, name)
        if os.path.isdir(name):
            templates += _get_templates(name)
        elif not name.endswith('.tpl'):
            templates.append(name)
    return templates


def prepare_directory(path):
    dirs = path.split('/')[:-1]
    if not dirs:
        return
    dirs = ['/'.join(dirs[:i+1]) for i in xrange(len(dirs))]
    for dir_name in dirs:
        if not os.path.isdir(dir_name):
            os.mkdir(dir_name)


def export_htmls(templates):
    env = Environment(loader=FileSystemLoader('templates'), variable_start_string="{[{", variable_end_string="}]}")
    for template in templates:
        rendered = env.get_template(template).render()
        template = 'exported/%s' % template
        prepare_directory(template)
        with open(template, 'w') as f:
            f.write(rendered)


def render():
    templates = get_templates()
    export_htmls(templates)


def auto_render():
    import time
    import datetime
    while True:
        try:
            render()
            print datetime.datetime.now().strftime('%H:%M:%S'), 'rendered'
            time.sleep(1)
        except KeyboardInterrupt:
            break


def run_server():
    import SimpleHTTPServer
    import SocketServer
    render()
    os.chdir('exported')
    port = int(raw_input('Port number(Default: 9338) >') or 9338)
    Handler = SimpleHTTPServer.SimpleHTTPRequestHandler
    httpd = SocketServer.TCPServer(('', port), Handler)
    httpd.serve_forever()


def main():
    functions = [dict(function=render, name='Rendering Templates'),
                 dict(function=auto_render, name="Auto rendering templates"),
                 dict(function=run_server, name='Run Server')]
    for i, function in enumerate(functions):
        print i+1, function['name']
    command = input('Input command > ')
    functions[command-1]['function']()

if __name__ == '__main__':
    main()