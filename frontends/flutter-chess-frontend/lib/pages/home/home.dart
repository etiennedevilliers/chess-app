import 'package:chess_frontend/cubits/authentication/authentication_cubit.dart';
import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Home Page"),
        actions: [
          IconButton(
            onPressed: GetIt.I<AuthenticationCubit>().logout,
            icon: const Icon(Icons.logout)
          )
        ],
      ),
    );
  }
}
