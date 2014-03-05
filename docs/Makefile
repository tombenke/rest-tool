DX = /home/tombenke/topics/dx/bin/md2html.js
PAGE_TEMPLATE = pageTemplate.html

%.html: %.md
	node $(DX) -t $(PAGE_TEMPLATE) -i $< -o $@

all: about.html \
	getHelp.html \
	getStarted.html \
	documentation.html \
	projects.html \
	services.html \
	server.html \
	docs.html \
	testing.html

# .PHONY: clean
# clean:
# 	rm -f *.html

