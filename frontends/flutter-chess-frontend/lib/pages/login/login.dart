import 'package:chess_frontend/cubits/authentication/authentication_cubit.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final TextEditingController unique = TextEditingController();
  final TextEditingController password = TextEditingController();
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  void login() {
    if (_formKey.currentState!.validate()) {
      GetIt.I<AuthenticationCubit>().login(
          unique: unique.text,
          password: password.text
      );

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Logging in...')),
      );
    }
  }

  void error(AuthenticationErrorState state) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Login error: ${state.message}')),
    );
  }

  Widget buildUniqueField() {
    return TextFormField(
      controller: unique,
      decoration: const InputDecoration(
        labelText: 'Unique Identifier',
      ),
      validator: (value) {
        if (value == null || value.isEmpty) {
          return 'Please enter your unique identifier';
        }
        return null;
      },
    );
  }

  Widget buildPasswordField() {
    return TextFormField(
      controller: password,
      decoration: const InputDecoration(
        labelText: 'Password',
      ),
      obscureText: true,
      validator: (value) {
        if (value == null || value.isEmpty) {
          return 'Please enter your password';
        }
        return null;
      },
    );
  }

  Widget buildLoginButton() {
    return Center(
      child: ElevatedButton(
        onPressed: login,
        child: const Text('Login'),
      ),
    );
  }

  Widget buildLoginForm() {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          buildUniqueField(),
          const SizedBox(height: 16),
          buildPasswordField(),
          const SizedBox(height: 32),
          buildLoginButton(),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Login"),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: BlocListener<AuthenticationCubit, AuthenticationState>(
          bloc: GetIt.I<AuthenticationCubit>(),
          listener: (context, state) {
            if (state is AuthenticationErrorState) {
              error(state);
            }
          },
          child: BlocBuilder<AuthenticationCubit, AuthenticationState>(
            bloc: GetIt.I<AuthenticationCubit>(),
            builder: (context, state) {
              if (state is AuthenticationLoadingState) {
                return Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const CircularProgressIndicator(),
                    Text(state.message)
                  ],
                );
              }

              return buildLoginForm();
            },
          ),
        ),
      ),
    );
  }
}
