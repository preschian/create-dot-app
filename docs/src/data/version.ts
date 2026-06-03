// CLI version, read from the create-dot-app package so the header and footer
// version badge always tracks the published CLI version.
import cliPackage from '../../../cli/package.json';

export const CLI_VERSION = `v${cliPackage.version}`;
