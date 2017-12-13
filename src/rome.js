import _ from 'lodash'
import { loadJsonFileSync } from 'datafile'

const execNotDefined = (context, commandArgs) => console.log('executive is not defined')

module.exports = (defaults, cli, exec, startup=[], shutdown=[]) => {
    const { cliConfig, command } = cli.parse(defaults)
    const configFile = _.merge({}, loadJsonFileSync(defaults.configFileName, false), loadJsonFileSync(cliConfig.configFileName, false))
    const config = _.merge({}, defaults, configFile, cliConfig)
    const container = {
        config: config
    }

    return ({
        start: () => {
            console.log('app is starting...', config, command.args)
            //TODO: startup
            const executive = exec[command.name] || execNotDefined
            executive(container, command)
        },
        stop: () => {
            // TODO: shutdown
            console.log('app is stopping...')
        }
    })
}
