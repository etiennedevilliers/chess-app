class User {
  final String unique;

  User({required this.unique});

  factory User.fromMap(Map<String, dynamic> map) {
    return User(
      unique: map['unique'] as String
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'unique': unique
    };
  }
}