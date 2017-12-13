const docgen = require('./docgen')
const servicegen = require('./servicegen')
const prjgen = require('./prjgen')
const testgen = require('./testgen')

module.exports = {
    create: prjgen.create,
    add: servicegen.add,
    addBulk: servicegen.addBulk,
    test: testgen.update,
    docs: docgen.update
}
