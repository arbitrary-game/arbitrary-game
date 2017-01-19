import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import GamesListComponent from './GamesListComponent';

export default createContainer(({ params }) => {
  return {};
}, GamesListComponent);
