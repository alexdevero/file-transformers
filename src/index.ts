import { main } from './transform-content'

const defaultDirPath = './foo/'

main(defaultDirPath, new RegExp('foo', 'g'), 'bar');
