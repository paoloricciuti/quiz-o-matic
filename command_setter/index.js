const fs = require("fs").promises;
const path = require("path");
const utils = require("../utils");

(async () => {
    const { SCOPES_ENUM } = utils;
    const commands = await fs.readdir(path.join(__dirname, "../commands"));
    const scopesMap = new Map();
    for (let command of commands) {
        const { scope = SCOPES_ENUM.DEFAULT, description } = require(path.join(__dirname, "../commands", command));
        const name = command.replace(".js", "");
        const commandArr = scopesMap.get(scope);
        scopesMap.set(scope, [...(commandArr || []), {
            command: name,
            description: description || `The /${name} command`,
        }]);
    }
    utils.setCommands(scopesMap);
})();