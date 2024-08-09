import 'dart:convert';

import 'package:chess_frontend/apis/api_exception.dart';
import 'package:chess_frontend/apis/authentication/logged_in_response.dart';
import 'package:chess_frontend/core/ConfigManager.dart';
import 'package:chess_frontend/utilities/client.dart';

import 'package:http/http.dart' as http;

class AuthenticationApi {
  static Future<LoggedInResponse> login({
    required String unique,
    required String password,
  }) async {
    try {
      Uri uri = Uri.parse(
          '${ConfigManager.config.httpServer}/authentication/login');

      http.Response response = await http.post(uri,
          headers: ClientUtilities.buildHeaders(),
          body: jsonEncode({
            'unique': unique,
            'password': password
          })
      );

      if (response.statusCode == 200) {
        return LoggedInResponse.fromMap(jsonDecode(response.body));
      } else if (response.statusCode == 401) {
        throw ApiException(reason: jsonDecode(response.body)['reason']);
      }

      throw ApiException(reason: 'Unknown status code ${response.statusCode}');
    } on ApiException {
      rethrow;
    } on http.ClientException catch (error, stackTrace) {
      throw ApiException(reason: error.message, error: error, stackTrace: stackTrace);
    } catch (error, stackTrace) {
      throw ApiException(reason: 'Unexpected error', error: error, stackTrace: stackTrace);
    }
  }
}
