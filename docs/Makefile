DX = /home/tombenke/topics/dx/bin/md2html.js
PAGE_TEMPLATE = pageTemplate.html

%.html: %.md
	node $(DX) -t $(PAGE_TEMPLATE) -i $< -o $@

all: about.html documentation.html getHelp.html getStarted.html

# .PHONY: clean
# clean:
# 	rm -f *.html

