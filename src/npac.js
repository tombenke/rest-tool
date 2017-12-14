import _ from 'lodash'
import { loadJsonFileSync } from 'datafile'

const execNotDefined = (context, commandArgs) => console.log('executive is not defined')

const makeConfig = (defaults, cliConfig) => {
    const configFile = _.merge({},
            defaults.configFileName ? loadJsonFileSync(defaults.configFileName, false) : {},
            cliConfig.configFileName ? loadJsonFileSync(cliConfig.configFileName, false) : {})
    const config = _.merge({}, defaults, configFile, cliConfig)
    return config
}

module.exports = (defaults, cli, exec, startup=[], shutdown=[]) => {
    const { cliConfig, command } = cli.parse(defaults)
    const container = {
        config: makeConfig(defaults, cliConfig),
        logger: console
    }

    return ({
        start: () => {
            console.log('app is starting...', container, command.args)
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
