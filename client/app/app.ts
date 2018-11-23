import * as angular from 'angular';

// Styles
import './app.scss';

// Modules
import Core from  './core/core';
import Main from  './main/main';
import Personal from  './personal/personal';

angular.module('app', [Core, Main, Personal]);
