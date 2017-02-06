import {LoggedInMixin} from "meteor/tunifight:loggedin-mixin";
import {ValidatedMethod} from "meteor/mdg:validated-method";
import Players from "../Players/PlayersCollection";
import Games from "../Games/GamesCollection";
import {PlayerCreateSchema} from "/imports/api/Players/PlayersSchema";

export const PlayersInsert = new ValidatedMethod({
  name: 'Players.insert',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'You need to be logged in to call this method',
    reason: 'You need to login'
  },
  validate: PlayerCreateSchema.validator(),
  run: ({gameId}) => {
    // TODO: https://trello.com/c/kPqli5OZ/87-withdraw-money-from-user-when-he-joins-the-game

    const exists = Players.find({gameId, userId: Meteor.userId()}).count() > 0;
    const {startedAt} = Games.findOne(gameId, {fields: {startedAt: 1}});

    if (!exists && !startedAt) {
      // TODO: use upsert?
      // TOOD: calulate stash
      return Players.insert({gameId, userId: Meteor.userId(), stash: 500});
    }
  }
});
