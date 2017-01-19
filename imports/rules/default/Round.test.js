'use strict';
/* eslint-env mocha */
import _ from "lodash";
import {Meteor} from "meteor/meteor";
import {expect} from "meteor/practicalmeteor:chai";
import Round from "./Round.js";

if (Meteor.isServer) {
  const createRound = () => new Round([
    {
      player: 'Alice', stash: 500, bet: 100, stake: 300, vote: 'Alice'
    },
    {
      player: 'Bob', stash: 500, bet: 100, stake: 100, vote: 'Bob'
    },
    {
      player: 'Winston', stash: 500, bet: 0, stake: 400, vote: 'Bob'
    },
    {
      player: 'Franklin', stash: 500, bet: 0, stake: 500, vote: 'Bob'
    },
    {
      player: 'Stalin', stash: 500, bet: 0, stake: 10, vote: 'Bob'
    }
  ]);

  describe('Round with default rules', function() {

    it('calculatePower', function() {
      const round = createRound();
      round.calculatePower();
      const result = round.params;
      expect(result.length).to.be.equal(5);
      for (const row of result) {
        expect(row).to.have.property('power');
      }
    });

    it('calculateWinner', function() {
      const round = createRound();
      round.calculatePower();
      round.calculateWinner();
      const result = round.params;
      expect(result.length).to.be.equal(5);
      for (const row of result) {
        expect(row).to.have.property('winner');
      }
      expect(result[0].winner).to.be.equal(false);
      expect(result[1].winner).to.be.equal(true);
      expect(result[2].winner).to.be.equal(null);
    });

    it('calculateMajority', function() {
      const round = createRound();
      round.calculatePower();
      round.calculateWinner();
      round.calculateMajority();
      const result = round.params;
      expect(result.length).to.be.equal(5);
      for (const row of result) {
        expect(row).to.have.property('majority');
      }
      expect(result[0].majority).to.be.equal(false);
      expect(result[1].majority).to.be.equal(true);
      expect(result[2].majority).to.be.equal(true);
    });

    it('calculateShare', function() {
      const round = createRound();
      round.calculatePower();
      round.calculateWinner();
      round.calculateMajority();
      round.calculateShare();
      const result = round.params;
      expect(result.length).to.be.equal(5);
      for (const row of result) {
        expect(row).to.have.property('share');
      }
      expect(result[0].share).to.be.equal(-1);
      expect(result[1].share).to.be.equal(0.1);
      expect(result[2].share).to.be.equal(0.4);
      expect(result[3].share).to.be.equal(0.5);
      expect(result[4].share).to.be.equal(0.01);
    });

    it('calculateScalp', function() {
      const round = createRound();
      round.calculatePower();
      round.calculateWinner();
      round.calculateMajority();
      round.calculateShare();
      round.calculateScalp();
      const result = round.params;
      expect(result.length).to.be.equal(5);
      for (const row of result) {
        expect(row).to.have.property('scalp');
      }
      expect(result[0].scalp).to.be.equal(-300);
      expect(result[1].scalp).to.be.equal(30);
      expect(result[2].scalp).to.be.equal(120);
      expect(result[3].scalp).to.be.equal(150);
      expect(result[4].scalp).to.be.equal(3);
    });

    it('calculatePrize', function() {
      const round = createRound();
      round.calculatePower();
      round.calculateWinner();
      round.calculateMajority();
      round.calculateShare();
      round.calculateScalp();
      round.calculatePrize();
      const result = round.params;
      expect(result.length).to.be.equal(5);
      for (const row of result) {
        expect(row).to.have.property('prize');
      }
      expect(result[0].prize).to.be.equal(-100);
      expect(result[1].prize).to.be.equal(100);
      expect(result[2].prize).to.be.equal(0);
      expect(result[3].prize).to.be.equal(0);
      expect(result[4].prize).to.be.equal(0);
    });

    it('calculateFix', function() {
      const round = createRound();
      round.calculatePower();
      round.calculateWinner();
      round.calculateMajority();
      round.calculateShare();
      round.calculateScalp();
      round.calculatePrize();
      round.calculateFix();
      const result = round.params;
      expect(result.length).to.be.equal(5);
      for (const row of result) {
        expect(row).to.have.property('fix');
      }
      expect(result[0].fix).to.be.equal(-3);
      expect(result[1].fix).to.be.equal(0);
      expect(result[2].fix).to.be.equal(0);
      expect(result[3].fix).to.be.equal(0);
      expect(result[4].fix).to.be.equal(0);
    });

    it('calculateTotal', function() {
      const round = createRound();
      round.calculatePower();
      round.calculateWinner();
      round.calculateMajority();
      round.calculateShare();
      round.calculateScalp();
      round.calculatePrize();
      round.calculateFix();
      round.calculateTotal();
      const result = round.params;
      expect(result.length).to.be.equal(5);
      for (const row of result) {
        expect(row).to.have.property('total');
      }
      expect(result[0].total).to.be.equal(97);
      expect(result[1].total).to.be.equal(630);
      expect(result[2].total).to.be.equal(620);
      expect(result[3].total).to.be.equal(650);
      expect(result[4].total).to.be.equal(503);
    });

    it('calculate', function() {
      const round = createRound();
      const result = round.calculate();
      expect(result.length).to.be.equal(5);
      for (const row of result) {
        expect(row).to.have.property('power');
        expect(row).to.have.property('winner');
        expect(row).to.have.property('majority');
        expect(row).to.have.property('share');
        expect(row).to.have.property('scalp');
        expect(row).to.have.property('prize');
        expect(row).to.have.property('fix');
        expect(row).to.have.property('total');

        expect(row.bet + row.stake).to.be.at.most(row.stash);
      }
      const totalRound = _.sumBy(result, i => i.total);
      const previousTotal = _.sumBy(result, i => i.stash);
      expect(totalRound).to.be.equal(previousTotal);
    });

  });

}