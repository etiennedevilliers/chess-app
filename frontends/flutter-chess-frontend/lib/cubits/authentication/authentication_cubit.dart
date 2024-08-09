import 'package:chess_frontend/apis/api_exception.dart';
import 'package:chess_frontend/apis/authentication/authentication_api.dart';
import 'package:chess_frontend/utilities/auth_token.dart';
import 'package:chess_frontend/utilities/logger.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../apis/authentication/logged_in_response.dart';
import '../../models/authentication/user.dart';

part 'authentication_state.dart';

class AuthenticationCubit extends Cubit<AuthenticationState> {
  AuthenticationCubit(): super(AuthenticationInitState()) { _init(); }

  void _init() {
    emit(AuthenticationLoggedOutState());
  }

  Future<void> login({ required String unique, required String password }) async {
    emit(AuthenticationLoadingState('Logging in...'));

    try {
      LoggedInResponse response = await AuthenticationApi.login(unique: unique, password: password);

      AuthToken.setToken(response.jwt);

      emit(AuthenticationLoggedInState(
        user: response.user
      ));
    } catch (error, stackTrace) {
      emit(AuthenticationErrorState(error: error, stackTrace: stackTrace));
    }
  }
}