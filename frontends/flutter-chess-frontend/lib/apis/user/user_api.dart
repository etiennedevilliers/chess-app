import 'dart:convert';

import 'package:chess_frontend/apis/api_exception.dart';
import 'package:chess_frontend/core/ConfigManager.dart';
import 'package:chess_frontend/models/authentication/user.dart';
import 'package:chess_frontend/utilities/client.dart';
import 'package:http/http.dart' as http;

class UserApi {
  static Future<User> create({
    required String unique,
    required String password
  }) async {
    try {
      Uri uri = Uri.parse(
          '${ConfigManager.config.httpServer}/users');

      http.Response response = await http.post(uri,
          headers: ClientUtilities.buildHeaders(),
          body: jsonEncode({
            'unique': unique,
            'password': password
          })
      );

      if (response.statusCode == 201) {
        return User.fromMap(jsonDecode(response.body));
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