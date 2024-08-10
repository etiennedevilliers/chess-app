import 'dart:convert';

import 'package:chess_frontend/apis/api_exception.dart';
import 'package:chess_frontend/apis/authentication/authentication_api.dart';
import 'package:chess_frontend/utilities/auth_token.dart';
import 'package:chess_frontend/utilities/logger.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../apis/authentication/logged_in_response.dart';
import '../../models/authentication/user.dart';

part 'authentication_state.dart';

class AuthenticationCubit extends Cubit<AuthenticationState> {
  AuthenticationCubit(): super(AuthenticationInitState()) { _init(); }

  Future<void> _init() async {
    emit(AuthenticationLoadingState('init'));

    String? jwt = GetIt.I<SharedPreferences>().getString('jwt');
    String? user = GetIt.I<SharedPreferences>().getString('user');

    if ((jwt == null || user == null) || (jwt.isEmpty || user.isEmpty)) {
      emit(AuthenticationLoggedOutState());
      return;
    }

    AuthToken.setToken(jwt);
    emit(AuthenticationLoggedInState(
      user: User.fromMap(jsonDecode(user))
    ));
  }

  Future<void> login({ required String unique, required String password }) async {
    emit(AuthenticationLoadingState('Logging in...'));

    try {
      LoggedInResponse response = await AuthenticationApi.login(unique: unique, password: password);

      AuthToken.setToken(response.jwt);

      await GetIt.I<SharedPreferences>().setString('user', jsonEncode(response.user.toMap()));
      await GetIt.I<SharedPreferences>().setString('jwt', response.jwt);

      emit(AuthenticationLoggedInState(
        user: response.user
      ));
    } catch (error, stackTrace) {
      emit(AuthenticationErrorState(error: error, stackTrace: stackTrace));
    }
  }

  Future<void> logout() async {
    await GetIt.I<SharedPreferences>().setString('user', '');
    await GetIt.I<SharedPreferences>().setString('jwt', ''); 

    emit(AuthenticationLoggedOutState());
  }
}