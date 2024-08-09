class ApiException {
  final String reason;

  final Object? error;

  final StackTrace? stackTrace;

  ApiException({required this.reason, this.error, this.stackTrace});
}