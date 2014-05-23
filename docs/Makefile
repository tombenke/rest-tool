DX = /home/tombenke/topics/dx/bin/md2html.js
PAGE_TEMPLATE = pageTemplate.html

%.html: %.md
	node $(DX) -t $(PAGE_TEMPLATE) -i $< -o $@

all: about.html \
	changelog.html \
	docs.html \
	documentation.html \
	getHelp.html \
	getStarted.html \
	projects.html \
	references.html \
	services.html \
	server.html \
	testing.html

# .PHONY: clean
# clean:
# 	rm -f *.html

