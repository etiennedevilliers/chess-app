import test from 'superwstest'
import * as root from '../src/index';

before(async () => {
    await root.start();
});

after(async () => {
    await root.stop();
});