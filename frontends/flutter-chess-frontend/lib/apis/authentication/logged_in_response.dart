import 'package:chess_frontend/models/authentication/user.dart';

class LoggedInResponse {
  final User user;
  final String jwt;

  LoggedInResponse({required this.user, required this.jwt});

  factory LoggedInResponse.fromMap(Map<String, dynamic> map) {
    return LoggedInResponse(
        user: User.fromMap(map['user'] as Map<String, dynamic>),
        jwt: map['jwt'] as String
    );
  }
}