import 'package:chess_frontend/cubits/authentication/authentication_cubit.dart';
import 'package:chess_frontend/utilities/logger.dart';
import 'package:get_it/get_it.dart';
import 'package:shared_preferences/shared_preferences.dart';

Logger logger = Logger('Setup');

class Setup {
  static Future<void> init() async {
    logger.info('init');
    await _initLibraries();
    _initCubits();
    logger.info('init complete');
  }

  static Future<void> _initLibraries() async {
    GetIt.I.registerSingleton(await SharedPreferences.getInstance());
  }

  static void _initCubits() {
    GetIt.I.registerSingleton(AuthenticationCubit());
  }
}