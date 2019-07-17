from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import spacy
import logging
import requests
nlp = spacy.load('en_core_web_lg')

PORT = 4000

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
        fields = json.loads(post_data.decode('utf-8'))
        bookName = fields["bookName"]
        author = fields["author"]
        response = requests.get('https://www.googleapis.com/books/v1/volumes?q=' + bookName + " " + author + '&orderBy=relevance&langRestrict=en')
        json_response = response.json()

        for i in json_response['items']:
            if "description" in i["volumeInfo"]:
                # print(i["volumeInfo"]["authors"][0])
                # print(i["volumeInfo"]["title"])
                result_doc = {}
                persons = []
                locationsAndGPE = []
                result_doc["title"] = i["volumeInfo"]["title"]
                category = i["volumeInfo"]["categories"][0]
                categories = ["Arts and photography", "Biographies and memoirs", "Business and investing", "Children's books", "Cookbooks, food and wine", "History", "Literature and Fiction", "Mystery and suspense", "Romance", "Sci-Fi and Fantasy", "Teens and young adults"]
                source = nlp(category) 
                maxval = 0.0
                maxtar = ""

                for j in categories:
                        target = nlp(j)
                        calc = target.similarity(source)
                        if calc > maxval:
                                maxval = calc
                                maxtar = j
                result_doc["author"] = i["volumeInfo"]["authors"][0]
                result_doc["category"] = maxtar
                doc = nlp(i["volumeInfo"]["description"])
                for ent in doc.ents:
                    if ent.label_ == "PERSON":
                        persons.append(ent.text)
                    if ent.label_ == "LOC":
                        locationsAndGPE.append(ent.text)
                    if ent.label_ == "GPE":
                        locationsAndGPE.append(ent.text)
                result_doc["persons"] = persons
                result_doc["locationsAndGPE"] = locationsAndGPE
                print(result_doc)
                break        

        self._set_response()
        self.wfile.write(json.dumps(result_doc).encode('utf-8'))
        # with open('book.json', 'w') as fp:
        #     json.dump(result_doc, fp)

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
