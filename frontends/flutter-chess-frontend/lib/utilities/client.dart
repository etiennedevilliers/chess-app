import 'package:chess_frontend/utilities/auth_token.dart';

class ClientUtilities {
  static Map<String, String> buildHeaders() {
    Map<String, String> headers = <String, String>{
      'Content-Type': 'application/json'
    };

    AuthToken.populateHeader(header: headers);

    return headers;
  }
}