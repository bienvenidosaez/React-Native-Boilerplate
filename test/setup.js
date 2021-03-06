import fs from 'fs';
import path from 'path';
import register from 'babel-core/register';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import dirtyChai from 'dirty-chai';
import chaiEnzyme from 'chai-enzyme';
import mockery from "mockery";

// Ignore all node_modules except these
const modulesToCompile = [
  'react-native',
  'apsl-react-native-button',
  'react-native-router-flux',
  'react-native-tabs',
  'react-native-vector-icons',
  'react-native-mock',
  'react-native-parallax-scroll-view',
  'react-native-simple-store'
].map((moduleName) => new RegExp(`/node_modules/${moduleName}`));
const rcPath = path.join(__dirname, '..', '.babelrc');
const source = fs.readFileSync(rcPath).toString();
const config = JSON.parse(source);
config.ignore = function(filename) {
  if (!(/\/node_modules\//).test(filename)) {
    return false;
  } else {
    const matches = modulesToCompile.filter((regex) => regex.test(filename));
    const shouldIgnore = matches.length === 0;
    return shouldIgnore;
  }
}
register(config);

// Setup globals / chai
global.__DEV__ = true;
global.expect = chai.expect;
global.assert = chai.assert;

chai.use(chaiEnzyme());
chai.use(chaiAsPromised);
chai.use(dirtyChai);

// Setup mocks
require('react-native-mock/mock');
const React = require('react-native')
React.NavigationExperimental = {
  AnimatedView: React.View
};

mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false
});
mockery.registerMock('react-native-router-flux', {Actions:{}});
