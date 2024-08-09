abstract class Config {
  String get server;

  String get http;

  String get ws;

  String get httpServer => '$http://$server';

  String get wsServer => '$ws://$server';
}

class LocalConfig extends Config {
  @override
  String get server => 'localhost:3000';

  @override
  String get http => 'http';

  @override
  String get ws => 'ws';
}

class ConfigManager {
  static Config get config => LocalConfig();
}