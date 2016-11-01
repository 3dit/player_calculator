angular.module('app')

.service('playerService', function(_) {

  var players = [];
  var idSeq = 0;
  var maxTransactionsDisplayed = 15;

  var addPlayer = function(name, amount) {
    var txamount = 0;
    if(typeof amount == 'undefined') txamount = 5000;
    var newPlayer = new gamePlayer(name, txamount);
    players.push(newPlayer);
    return newPlayer;
  }

  var gamePlayer = function(name, amount) {
    var self = this;
    
    var vm = this;
    
    vm.id = players.length;
    vm.name = name;
    vm.properties = [];
    vm.transactions = [];
    
    var txamount = 5000;
    if(typeof amount != 'undefined') txamount = amount;
    
    vm.undoLastTx = function() {
      var self = this;
      if (!self.transactions || self.transactions.length === 0) return;
      self.transactions = _.dropRight(self.transactions, 1);
    };
    vm.totalAmount = function() {
      var self = this;
      return _.sum(self.transactions);
    };
    vm.transactAmount = function(amount) {
      var self = this;
      if (amount) self.transactions.push(amount);
    };
    vm.getTransactions = function() {
      var self = this;
      return self.transactions;
    }
    vm.topTransactions = function() {
      var self = this;
      return _.takeRight(self.transactions, maxTransactionsDisplayed);
    }
    //now we can perform functions on ourself
    if(txamount) vm.transactAmount(txamount);

    self.vm = vm;
    
    return self;
  }

  var getPlayer = function(id) {
    return _.find(players, {
      id: id
    });
  }

  var allPlayers = function() {
    return players;
  }
  
  var getTransactions = function() {
    
  }

  var defaults = function() {
    addPlayer('scott');
    addPlayer('gabe');
    addPlayer('michelle');
    addPlayer('mathhew');
    addPlayer('Community',0)
  }

  return {
    addPlayer: addPlayer,
    getPlayer: getPlayer,
    allPlayers: allPlayers,
    defaults: defaults,
    getTransactions: getTransactions
  }

});