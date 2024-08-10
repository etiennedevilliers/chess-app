import 'package:chess_frontend/apis/api_exception.dart';
import 'package:chess_frontend/apis/user/user_api.dart';
import 'package:chess_frontend/cubits/authentication/authentication_cubit.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final TextEditingController unique = TextEditingController();
  final TextEditingController password = TextEditingController();
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  Future<void> register() async {
    if (_formKey.currentState!.validate()) {
      try {
        await UserApi.create(
          unique: unique.text,
          password: password.text
        );

        if (mounted) {
          Navigator.of(context).pop();
        }
      } on ApiException catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(e.reason)),
          );
        }
      }
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

  Widget buildActions() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.end,
      mainAxisSize: MainAxisSize.max,
      children: [
        ElevatedButton(
          onPressed: register,
          child: const Text('Register'),
        ),
      ],
    );
  }

  Widget buildRegisterForm() {
    return Center(
      child: ConstrainedBox(
        constraints: const BoxConstraints(
          maxWidth: 400
        ),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              buildUniqueField(),
              const SizedBox(height: 16),
              buildPasswordField(),
              const SizedBox(height: 32),
              buildActions(),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Register"),
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

              return buildRegisterForm();
            },
          ),
        ),
      ),
    );
  }
}
