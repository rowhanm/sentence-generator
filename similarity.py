import spacy
import time

import requests

from http.server import BaseHTTPRequestHandler, HTTPServer
import logging

class S(BaseHTTPRequestHandler):
    def _set_response(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def do_GET(self):
        logging.info("GET request,\nPath: %s\nHeaders:\n%s\n", str(self.path), str(self.headers))
        self._set_response()
        self.wfile.write("GET request for {}".format(self.path).encode('utf-8'))

    def do_POST(self):
        content_length = int(self.headers['Content-Length']) # <--- Gets the size of data
        post_data = self.rfile.read(content_length) # <--- Gets the data itself
        logging.info("POST request,\nPath: %s\nHeaders:\n%s\n\nBody:\n%s\n",
                str(self.path), str(self.headers), post_data.decode('utf-8'))

        self._set_response()
        self.wfile.write("POST request for {}".format(self.path).encode('utf-8'))

def run(server_class=HTTPServer, handler_class=S, port=8080):
    logging.basicConfig(level=logging.INFO)
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    logging.info('Starting httpd...\n')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    logging.info('Stopping httpd...\n')

if __name__ == '__main__':
    from sys import argv

    if len(argv) == 2:
        run(port=int(argv[1]))
    else:
        run()



# bookName = "homo deus"
# author = "harari"

# response = requests.get(
#     'https://www.googleapis.com/books/v1/volumes?q=' + bookName + " " + author + '&orderBy=relevance&langRestrict=en'
# )

# flag = 0
# json_response = response.json()
# if len(json_response['items']) < 0:
#         category = "Default"
#         flag = 1
# else:               
#         category = json_response['items'][0]['volumeInfo']['categories'][0]

# start_time = time.time()
# nlp = spacy.load('en_core_web_lg')

# categories = ["Arts and photography", "Biographies and memoirs", "Business and investing", "Children's books", "Cookbooks, food and wine", "History", "Literature and Fiction", "Mystery and suspense", "Romance", "Sci-Fi and Fantasy", "Teens and young adults"]

# if flag == 1:
#         print("Default")
#         exit()
# source = nlp(category) 
# maxval = 0.0
# maxtar = ""

# for i in categories:
#     target = nlp(i)
#     calc = target.similarity(source)
#     if calc > maxval:
#         maxval = calc
#         maxtar = i

# print(str(maxval) + ": " + maxtar)
# print("--- %s seconds ---" % (time.time() - start_time))
