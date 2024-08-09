class AuthToken {
  static String? _token;

  static String? get token => _token;

  static void setToken(String token) {
    _token = token;
  }

  static Map<String, String> populateHeader({ Map<String, String>? header }) {
    if (header == null) {
      Map<String, String> newHeader = <String, String>{};
      _populateHeader(newHeader);
      return newHeader;
    } else {
      _populateHeader(header);
      return header;
    }
  }

  static void _populateHeader(Map<String, String> header) {
    if (_token != null) {
      header['Authorization'] = 'Bearer $_token';
    }
  }
}