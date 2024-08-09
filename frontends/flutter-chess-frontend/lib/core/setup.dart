import 'package:chess_frontend/cubits/authentication/authentication_cubit.dart';
import 'package:chess_frontend/utilities/logger.dart';
import 'package:get_it/get_it.dart';

Logger logger = Logger('Setup');

class Setup {
  static Future<void> init() async {
    logger.info('init');
    _initCubits();
    logger.info('init complete');
  }

  static void _initCubits() {
    GetIt.I.registerSingleton(AuthenticationCubit());
  }
}