part of 'authentication_cubit.dart';

Logger logger = Logger('AuthenticationState');

abstract class AuthenticationState extends Equatable { }

class AuthenticationInitState extends AuthenticationState {
  @override
  List<Object?> get props => [];
}

class AuthenticationLoadingState extends AuthenticationState {
  final String message;

  AuthenticationLoadingState(this.message);

  @override
  List<Object?> get props => [message];
}

class AuthenticationLoggedInState extends AuthenticationState {
  final User user;

  AuthenticationLoggedInState({ required this.user });

  @override
  List<Object?> get props => [user];
}

class AuthenticationLoggedOutState extends AuthenticationState {
  @override
  List<Object?> get props => [];
}

class AuthenticationErrorState extends AuthenticationState {
  late final String message;
  final Object? error;
  final StackTrace? stackTrace;

  AuthenticationErrorState({required this.error, required this.stackTrace}) {
    if (error is ApiException) {
      ApiException apiException = error as ApiException;
      message = apiException.reason;
    } else {
      message = 'Unknown error: $error';
    }
  }

  @override
  List<Object?> get props => [error, stackTrace];
}