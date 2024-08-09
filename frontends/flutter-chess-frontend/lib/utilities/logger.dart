import 'dart:developer';

class Logger {
  final String context;

  Logger(this.context);

  void info(String message) {
    log('$context: $message');
  }

  void error(String reason, { Object? error, StackTrace? stackTrace }) {
    log('$context ERROR: $reason', error: error, stackTrace: stackTrace);
  }
}