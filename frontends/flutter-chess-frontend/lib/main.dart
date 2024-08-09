import 'package:chess_frontend/core/setup.dart';
import 'package:chess_frontend/cubits/authentication/authentication_cubit.dart';
import 'package:chess_frontend/pages/home/home.dart';
import 'package:chess_frontend/pages/login/login.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';

Future<void> main() async {
  await Setup.init();

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  Widget buildRoot() {
    return BlocBuilder<AuthenticationCubit, AuthenticationState>(
      bloc: GetIt.I<AuthenticationCubit>(),
      builder: (context, state) {
        if (state is AuthenticationLoggedInState) {
          return const HomePage();
        } else {
          return const LoginPage();
        }
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Chess App',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: buildRoot(),
    );
  }
}

