# DONASIKU-PBO (Backend)

Backend aplikasi **Donasiku** untuk mata kuliah Pemrograman Berorientasi Objek (PBO).

---

## 👤 Author
- **arkbil**

---

## 📊 SonarQube Code Quality Report -> #1

**Branch:** `master`  
**Quality Gate:** ✅ **PASSED**  
**Analysis Tool:** SonarQube  
**Analysis Type:** Static Code Analysis

### Overall Code Metrics
| Category | Status | Detail |
|--------|--------|--------|
| Security | **E** | 4 vulnerabilities |
| Reliability | **C** | 39 bugs |
| Maintainability | **A** | 296 code smells |
| Security Hotspots | **E** | 5 hotspots |
| Test Coverage | **0.0%** | ~1.4k lines |
| Duplications | **0.0%** | ~4.5k lines |

> Walaupun masih terdapat banyak issue, **Quality Gate tetap PASSED** karena threshold yang digunakan tidak memblokir kondisi tersebut pada branch ini.

---

## 🧠 Interpretasi Hasil
- Project **lulus Quality Gate**, sehingga dianggap layak secara kualitas minimum.
- Namun masih terdapat:
  - Banyak **Code Smell** → masalah maintainability
  - Beberapa **Bug** → potensi error runtime
  - **Vulnerability (BLOCKER)** → isu keamanan serius
- Coverage masih **0%**, artinya **belum ada unit test**.

---

## 🔗 SonarQube Dashboard
Detail laporan lengkap dapat dilihat pada:
http://localhost:9000/dashboard?id=pbo

# 📌 Detailed SonarQube Issues (Full & Grouped)


---

## 🔐 VULNERABILITIES (Security Issues)

1. [VULNERABILITY/BLOCKER] Revoke and change this password, as it is compromised.  
   (DataSeeder.java:87)

2. [VULNERABILITY/BLOCKER] Revoke and change this password, as it is compromised.  
   (AdminSetupController.java:62)

3. [VULNERABILITY/BLOCKER] Revoke and change this password, as it is compromised.  
   (DataSeeder.java:112)

4. [VULNERABILITY/BLOCKER] Revoke and change this password, as it is compromised.  
   (DataSeeder.java:127)

> ⚠️ Issue ini **sangat kritis** karena berkaitan dengan password hard-coded / terekspos.

---

## 🐞 BUGS (Reliability Issues)

1. [BUG/MAJOR] Make this method non-"private" or remove the "@Transactional" annotation.  
   (ChatService.java:111)

2. [BUG/MINOR] Use another way to initialize this instance.  
   (AdminSetupController.java:78)

3. [BUG/MINOR] Use another way to initialize this instance.  
   (AdminSetupController.java:90)

> Bug menunjukkan potensi error saat runtime meskipun aplikasi masih bisa dijalankan.

---

## 🧹 CODE SMELLS (Maintainability Issues)

> **Total: 296 issues**  
> Issue berikut berkaitan dengan:
- Duplikasi literal string
- Penggunaan wildcard generic (`<?>`)
- Field injection (disarankan constructor injection)
- Method terlalu kompleks (Cognitive Complexity)
- Penamaan package & constant tidak sesuai standar Java
- Penggunaan `System.out` / `System.err` (disarankan logger)

### Issue Code Smell

1. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.  
   (UserController.java:29)

2. [CODE_SMELL/CRITICAL] Define a constant instead of duplicating this literal "Admin tidak ditemukan".  
   (UserController.java:33)

3. [CODE_SMELL/CRITICAL] Define a constant instead of duplicating this literal "Akses ditolak: Hanya Admin yang diizinkan.".  
   (UserController.java:35)

4. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.  
   (UserController.java:181)

5. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.  
   (UserController.java:200)

6. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.  
   (UserController.java:244)

7. [CODE_SMELL/MINOR] Rename this package name to match Java naming convention.  
   (GlobalExceptionHandler.java:1)

8. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.  
   (GlobalExceptionHandler.java:16)

9. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.  
   (GlobalExceptionHandler.java:24)

10. [CODE_SMELL/MINOR] Rename this package name to match Java naming convention.  
    (ResourceNotFoundException.java:1)

11. [CODE_SMELL/MINOR] Make success a static final constant or non-public.  
    (DonasiController.java:218)

12. [CODE_SMELL/MINOR] Make message a static final constant or non-public.  
    (DonasiController.java:219)

13. [CODE_SMELL/CRITICAL] Define a constant instead of duplicating this literal "pending".  
    (PermintaanService.java:79)

14. [CODE_SMELL/MINOR] Remove the unnecessary boolean literal.  
    (PermintaanService.java:357)

15. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.  
    (DonasiController.java:124)

16. [CODE_SMELL/MINOR] Make success a static final constant or non-public.  
    (DonasiController.java:142)

17. [CODE_SMELL/MINOR] Make message a static final constant or non-public.  
    (DonasiController.java:143)

18. [CODE_SMELL/MINOR] Make data a static final constant or non-public.  
    (DonasiController.java:144)

19. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.  
    (PermintaanController.java:265)

20. [CODE_SMELL/MINOR] Make success a static final constant or non-public.  
    (PermintaanController.java:283)

21. [CODE_SMELL/MINOR] Make message a static final constant or non-public.  
    (PermintaanController.java:284)

22. [CODE_SMELL/MINOR] Make data a static final constant or non-public.  
    (PermintaanController.java:285)

23. [CODE_SMELL/MINOR] Make success a static final constant or non-public.  
    (PermintaanController.java:295)

24. [CODE_SMELL/MINOR] Make message a static final constant or non-public.  
    (PermintaanController.java:296)

25. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.  
    (PermintaanController.java:243)

26. [CODE_SMELL/CRITICAL] Define a constant instead of duplicating this literal "uploads".  
    (PermintaanService.java:40)

27. [CODE_SMELL/CRITICAL] Define a constant instead of duplicating this literal "Permintaan tidak ditemukan".  
    (PermintaanService.java:112)

28. [CODE_SMELL/CRITICAL] Refactor this method to reduce its Cognitive Complexity.  
    (PermintaanService.java:139)

29. [CODE_SMELL/MAJOR] Replace generic exceptions with specific exceptions.  
    (PermintaanService.java:154)

30. [CODE_SMELL/MAJOR] Replace generic exceptions with specific exceptions.  
    (PermintaanService.java:158)

31. [CODE_SMELL/MAJOR] Replace generic exceptions with specific exceptions.  
    (PermintaanService.java:172)

32. [CODE_SMELL/CRITICAL] Define a constant instead of duplicating this literal "approved".  
    (PermintaanService.java:193)

33. [CODE_SMELL/CRITICAL] Define a constant instead of duplicating this literal "Error: ".  
    (UserController.java:58)

34. [CODE_SMELL/CRITICAL] Refactor this method to reduce its Cognitive Complexity.  
    (AuthService.java:29)

35. [CODE_SMELL/CRITICAL] Refactor this method to reduce its Cognitive Complexity.  
    (DataSeeder.java:25)

36. [CODE_SMELL/INFO] Complete the task associated to this TODO comment.  
    (DataSeeder.java:93)

37. [CODE_SMELL/MAJOR] Remove commented-out code block.  
    (DataSeeder.java:150)

38. [CODE_SMELL/MAJOR] Remove commented-out code block.  
    (DataSeeder.java:169)

39. [CODE_SMELL/MAJOR] Remove commented-out code block.  
    (DataSeeder.java:188)

40. [CODE_SMELL/CRITICAL] Define a constant instead of duplicating this literal "karakter".  
    (AppConstants.java:35)

41. [CODE_SMELL/CRITICAL] Call transactional methods via injected dependency instead of this.  
    (AuthService.java:116)

42. [CODE_SMELL/MAJOR] Replace usage of System.out with logger.  
    (DataInitializer.java:30)

43. [CODE_SMELL/MAJOR] Replace usage of System.out with logger.  
    (DataSeeder.java:132)

44. [CODE_SMELL/CRITICAL] Rename constant to match Java constant naming convention.  
    (User.java:80)

45. [CODE_SMELL/CRITICAL] Rename constant to match Java constant naming convention.  
    (Lokasi.java:42)

46. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/constants/AppConstants.java:1)

47. [CODE_SMELL/CRITICAL] Define a constant instead of duplicating this literal " karakter" 6 times.
(pbo:src/main/java/Donasiku/spring/core/constants/AppConstants.java:35)

48. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/AuthController.java:62)

49. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/AuthController.java:141)

50. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/AuthController.java:147)

51. [CODE_SMELL/MINOR] Remove the unnecessary boolean literal.
(pbo:src/main/java/Donasiku/spring/core/controller/AuthController.java:159)

52. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/ChatController.java:62)

53. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/ChatController.java:74)

54. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/controller/DataFixController.java:16)

55. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/controller/DataFixController.java:18)

56. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/controller/DataFixController.java:20)

57. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/controller/DataFixController.java:22)

58. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/controller/DataFixController.java:24)

59. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/controller/LokasiController.java:1)

60. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/controller/LokasiController.java:16)

61. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/LokasiController.java:39)

62. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/LokasiController.java:52)

63. [CODE_SMELL/MINOR] Make success a static final constant or non-public and provide accessors if needed.
(pbo:src/main/java/Donasiku/spring/core/controller/LokasiController.java:83)

64. [CODE_SMELL/MINOR] Make message a static final constant or non-public and provide accessors if needed.
(pbo:src/main/java/Donasiku/spring/core/controller/LokasiController.java:84)

65. [CODE_SMELL/MINOR] Make latitude a static final constant or non-public and provide accessors if needed.
(pbo:src/main/java/Donasiku/spring/core/controller/LokasiController.java:85)

66. [CODE_SMELL/MINOR] Make longitude a static final constant or non-public and provide accessors if needed.
(pbo:src/main/java/Donasiku/spring/core/controller/LokasiController.java:86)

67. [CODE_SMELL/MINOR] Make radiusKm a static final constant or non-public and provide accessors if needed.
(pbo:src/main/java/Donasiku/spring/core/controller/LokasiController.java:87)

68. [CODE_SMELL/MINOR] Make locations a static final constant or non-public and provide accessors if needed.
(pbo:src/main/java/Donasiku/spring/core/controller/LokasiController.java:88)

69. [CODE_SMELL/MINOR] Make success a static final constant or non-public and provide accessors if needed.
(pbo:src/main/java/Donasiku/spring/core/controller/LokasiController.java:102)

70. [CODE_SMELL/MINOR] Make message a static final constant or non-public and provide accessors if needed.
(pbo:src/main/java/Donasiku/spring/core/controller/LokasiController.java:103)

71. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/controller/NotificationController.java:1)

72. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/NotificationController.java:19)

73. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/NotificationController.java:24)

74. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/PermintaanController.java:34)

75. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/PermintaanController.java:203)

76. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/controller/UserController.java:24)

77. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/UserController.java:68)

78. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/dto/ChatDTO.java:1)

79. [CODE_SMELL/MINOR] Rename this field "last_message" to match the regular expression '^[a-z][a-zA-Z0-9]*$'.
(pbo:src/main/java/Donasiku/spring/core/dto/ChatDTO.java:14)

80. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/dto/ChatPeerDTO.java:1)

81. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/dto/MessageDTO.java:1)

82. [CODE_SMELL/MINOR] Rename this field "sender_id" to match the regular expression '^[a-z][a-zA-Z0-9]*$'.
(pbo:src/main/java/Donasiku/spring/core/dto/MessageDTO.java:15)

83. [CODE_SMELL/MINOR] Rename this field "created_at" to match the regular expression '^[a-z][a-zA-Z0-9]*$'.
(pbo:src/main/java/Donasiku/spring/core/dto/MessageDTO.java:17)

84. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/dto/WebResponse.java:1)

85. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/entity/Admin.java:1)

86. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/repository/AdminRepository.java:1)

87. [CODE_SMELL/MAJOR] Replace generic exceptions with specific library exceptions or a custom exception.
(pbo:src/main/java/Donasiku/spring/core/service/AuthService.java:104)

88. [CODE_SMELL/CRITICAL] Call transactional methods via an injected dependency instead of directly via 'this'.
(pbo:src/main/java/Donasiku/spring/core/service/AuthService.java:116)

89. [CODE_SMELL/MAJOR] Replace generic exceptions with specific library exceptions or a custom exception.
(pbo:src/main/java/Donasiku/spring/core/service/AuthService.java:149)

90. [CODE_SMELL/MAJOR] Replace generic exceptions with specific library exceptions or a custom exception.
(pbo:src/main/java/Donasiku/spring/core/service/ChatService.java:55)

91. [CODE_SMELL/MAJOR] Replace this usage of Stream.collect(Collectors.toList()) with Stream.toList() and ensure that the list is unmodified.
(pbo:src/main/java/Donasiku/spring/core/service/ChatService.java:64)

92. [CODE_SMELL/MAJOR] Replace this usage of Stream.collect(Collectors.toList()) with Stream.toList() and ensure that the list is unmodified.
(pbo:src/main/java/Donasiku/spring/core/service/ChatService.java:83)

93. [CODE_SMELL/MAJOR] Replace generic exceptions with specific library exceptions or a custom exception.
(pbo:src/main/java/Donasiku/spring/core/service/DonasiService.java:255)

94. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/service/LokasiService.java:1)

95. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/service/LokasiService.java:14)

96. [CODE_SMELL/CRITICAL] Refactor this method to reduce its Cognitive Complexity from 21 to the 15 allowed.
(pbo:src/main/java/Donasiku/spring/core/service/PermintaanService.java:34)

97. [CODE_SMELL/MAJOR] Replace generic exceptions with specific library exceptions or a custom exception.
(pbo:src/main/java/Donasiku/spring/core/service/PermintaanService.java:47)

98. [CODE_SMELL/MAJOR] Replace generic exceptions with specific library exceptions or a custom exception.
(pbo:src/main/java/Donasiku/spring/core/service/PermintaanService.java:150)

99. [CODE_SMELL/MAJOR] Replace generic exceptions with specific library exceptions or a custom exception.
(pbo:src/main/java/Donasiku/spring/core/service/PermintaanService.java:222)

100. [CODE_SMELL/MAJOR] Replace generic exceptions with specific library exceptions or a custom exception.
(pbo:src/main/java/Donasiku/spring/core/service/PermintaanService.java:235)

101. [CODE_SMELL/CRITICAL] Define a constant instead of duplicating this literal "User tidak ditemukan" 4 times.
(pbo:src/main/java/Donasiku/spring/core/service/UserService.java:29)

102. [CODE_SMELL/MAJOR] Replace generic exceptions with specific library exceptions or a custom exception.
(pbo:src/main/java/Donasiku/spring/core/service/UserService.java:47)

103. [CODE_SMELL/MINOR] Remove this duplicated import.
(pbo:src/main/java/Donasiku/spring/core/controller/UserController.java:14)

104. [CODE_SMELL/CRITICAL] Define a constant instead of duplicating this literal "Error: User ID tidak valid" 3 times.
(pbo:src/main/java/Donasiku/spring/core/controller/UserController.java:47)

105. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/UserController.java:164)

106. [CODE_SMELL/MAJOR] Replace this usage of Stream.collect(Collectors.toList()) with Stream.toList() and ensure that the list is unmodified.
(pbo:src/main/java/Donasiku/spring/core/service/DonasiService.java:271)

107. [CODE_SMELL/MAJOR] Replace this usage of Stream.collect(Collectors.toList()) with Stream.toList() and ensure that the list is unmodified.
(pbo:src/main/java/Donasiku/spring/core/service/DonasiService.java:287)

108. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/service/UserService.java:22)

109. [CODE_SMELL/MINOR] Remove this unused "user" local variable.
(pbo:src/main/java/Donasiku/spring/core/service/UserService.java:83)

110. [CODE_SMELL/MAJOR] Remove this useless assignment to local variable "user".
(pbo:src/main/java/Donasiku/spring/core/service/UserService.java:83)

111. [CODE_SMELL/MAJOR] Replace this usage of Stream.collect(Collectors.toList()) with Stream.toList() and ensure that the list is unmodified.
(pbo:src/main/java/Donasiku/spring/core/service/UserService.java:90)

112. [CODE_SMELL/CRITICAL] Refactor this method to reduce its Cognitive Complexity from 21 to the 15 allowed.
(pbo:src/main/java/Donasiku/spring/core/controller/UserController.java:110)

113. [CODE_SMELL/MINOR] Use concise character class syntax '\\D' instead of '[^0-9]'.
(pbo:src/main/java/Donasiku/spring/core/controller/UserController.java:141)

114. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/controller/ChatController.java:1)

115. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/controller/ChatController.java:15)

116. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/ChatController.java:20)

117. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/ChatController.java:100)

118. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/DonasiController.java:155)

119. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/DonasiController.java:181)

120. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/PermintaanController.java:214)

121. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/controller/UserController.java:1)

122. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/controller/UserController.java:21)

123. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/UserController.java:44)

124. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/UserController.java:110)

125. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/service/ChatService.java:1)

126. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/service/ChatService.java:23)

127. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/service/ChatService.java:25)

128. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/service/ChatService.java:27)

129. [CODE_SMELL/CRITICAL] Call transactional methods via an injected dependency instead of directly via 'this'.
(pbo:src/main/java/Donasiku/spring/core/service/ChatService.java:39)

130. [BUG/MAJOR] Make this method non-"private" or remove the @Transactional annotation.
(pbo:src/main/java/Donasiku/spring/core/service/ChatService.java:111)

131. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/service/DonasiService.java:22)

132. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/service/DonasiService.java:24)

133. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/service/DonasiService.java:26)

134. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/service/DonasiService.java:28)

135. [CODE_SMELL/CRITICAL] Define a constant instead of duplicating this literal "Donasi tidak ditemukan" 5 times.
(pbo:src/main/java/Donasiku/spring/core/service/DonasiService.java:88)

136. [CODE_SMELL/MAJOR] Replace generic exceptions with specific library exceptions or a custom exception.
(pbo:src/main/java/Donasiku/spring/core/service/DonasiService.java:97)

137. [CODE_SMELL/MAJOR] Replace generic exceptions with specific library exceptions or a custom exception.
(pbo:src/main/java/Donasiku/spring/core/service/DonasiService.java:108)

138. [CODE_SMELL/MAJOR] Replace generic exceptions with specific library exceptions or a custom exception.
(pbo:src/main/java/Donasiku/spring/core/service/DonasiService.java:114)

139. [CODE_SMELL/MAJOR] Replace generic exceptions with specific library exceptions or a custom exception.
(pbo:src/main/java/Donasiku/spring/core/service/DonasiService.java:120)

140. [CODE_SMELL/MAJOR] Replace generic exceptions with specific library exceptions or a custom exception.
(pbo:src/main/java/Donasiku/spring/core/service/DonasiService.java:211)

141. [CODE_SMELL/MAJOR] Replace generic exceptions with specific library exceptions or a custom exception.
(pbo:src/main/java/Donasiku/spring/core/service/DonasiService.java:224)

142. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/service/PermintaanService.java:14)

143. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/service/PermintaanService.java:16)

144. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/service/PermintaanService.java:18)

145. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/service/PermintaanService.java:20)

146. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/service/PermintaanService.java:22)

147. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/service/PermintaanService.java:24)

148. [CODE_SMELL/MAJOR] Replace generic exceptions with specific library exceptions or a custom exception.
(pbo:src/main/java/Donasiku/spring/core/service/PermintaanService.java:336)

149. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/service/UserService.java:1)

150. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/service/UserService.java:18)

151. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/service/UserService.java:20)

152. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/DonasiController.java:69)

153. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/PermintaanController.java:178)

154. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/PermintaanController.java:192)

155. [CODE_SMELL/MAJOR] Replace generic exceptions with specific library exceptions or a custom exception.
(pbo:src/main/java/Donasiku/spring/core/service/DonasiService.java:144)

156. [CODE_SMELL/MAJOR] This block of commented-out lines of code should be removed.
(pbo:src/main/java/Donasiku/spring/core/config/DataSeeder.java:141)

157. [CODE_SMELL/MAJOR] This block of commented-out lines of code should be removed.
(pbo:src/main/java/Donasiku/spring/core/config/DataSeeder.java:162)

158. [CODE_SMELL/MAJOR] This block of commented-out lines of code should be removed.
(pbo:src/main/java/Donasiku/spring/core/config/DataSeeder.java:181)

159. [CODE_SMELL/MAJOR] This block of commented-out lines of code should be removed.
(pbo:src/main/java/Donasiku/spring/core/config/DataSeeder.java:199)

160. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/controller/DataFixController.java:1)

161. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/DonasiController.java:25)

162. [CODE_SMELL/MAJOR] Replace generic exceptions with specific library exceptions or a custom exception.
(pbo:src/main/java/Donasiku/spring/core/service/DonasiService.java:65)

163. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/config/DataInitializer.java:1)

164. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/config/DataInitializer.java:19)

165. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/config/DataInitializer.java:22)

166. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/config/DataInitializer.java:25)

167. [CODE_SMELL/MAJOR] Replace this use of System.out by a logger.
(pbo:src/main/java/Donasiku/spring/core/config/DataInitializer.java:30)

168. [CODE_SMELL/MAJOR] Replace this use of System.out by a logger.
(pbo:src/main/java/Donasiku/spring/core/config/DataInitializer.java:47)

169. [CODE_SMELL/MAJOR] Replace this use of System.out by a logger.
(pbo:src/main/java/Donasiku/spring/core/config/DataInitializer.java:53)

170. [CODE_SMELL/MAJOR] Replace this use of System.out by a logger.
(pbo:src/main/java/Donasiku/spring/core/config/DataInitializer.java:62)

171. [CODE_SMELL/MINOR] Remove this unused "penerima" local variable.
(pbo:src/main/java/Donasiku/spring/core/config/DataSeeder.java:122)

172. [CODE_SMELL/CRITICAL] Define a constant instead of duplicating this literal "penerima_test" 3 times.
(pbo:src/main/java/Donasiku/spring/core/config/DataSeeder.java:123)

173. [CODE_SMELL/MAJOR] Replace this use of System.out by a logger.
(pbo:src/main/java/Donasiku/spring/core/config/DataSeeder.java:132)

174. [CODE_SMELL/MAJOR] Replace this use of System.out by a logger.
(pbo:src/main/java/Donasiku/spring/core/config/DataSeeder.java:133)

175. [CODE_SMELL/MAJOR] Replace this use of System.out by a logger.
(pbo:src/main/java/Donasiku/spring/core/config/DataSeeder.java:134)

176. [CODE_SMELL/MAJOR] Replace this use of System.out by a logger.
(pbo:src/main/java/Donasiku/spring/core/config/DataSeeder.java:135)

177. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/PermintaanController.java:141)

178. [CODE_SMELL/MAJOR] Replace generic exceptions with specific library exceptions or a custom exception.
(pbo:src/main/java/Donasiku/spring/core/service/PermintaanService.java:58)

179. [CODE_SMELL/MAJOR] Replace generic exceptions with specific library exceptions or a custom exception.
(pbo:src/main/java/Donasiku/spring/core/service/PermintaanService.java:64)

180. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/config/WebConfig.java:1)

181. [CODE_SMELL/CRITICAL] Define a constant instead of duplicating this literal "ERROR" 5 times.
(pbo:src/main/java/Donasiku/spring/core/controller/VerifikasiController.java:51)

182. [CODE_SMELL/MINOR] Remove this hard-coded path-delimiter.
(pbo:src/main/java/Donasiku/spring/core/service/VerifikasiService.java:77)

183. [CODE_SMELL/CRITICAL] Define a constant instead of duplicating this literal "menunggu_verifikasi" 5 times.
(pbo:src/main/java/Donasiku/spring/core/service/VerifikasiService.java:81)

184. [CODE_SMELL/MINOR] Remove this unused "admin" local variable.
(pbo:src/main/java/Donasiku/spring/core/config/DataSeeder.java:82)

185. [CODE_SMELL/CRITICAL] Define a constant instead of duplicating this literal "admin" 3 times.
(pbo:src/main/java/Donasiku/spring/core/config/DataSeeder.java:83)

186. [VULNERABILITY/BLOCKER] Revoke and change this password, as it is compromised.
(pbo:src/main/java/Donasiku/spring/core/config/DataSeeder.java:87)

187. [CODE_SMELL/MAJOR] Replace this use of System.out by a logger.
(pbo:src/main/java/Donasiku/spring/core/config/DataSeeder.java:97)

188. [CODE_SMELL/MAJOR] Replace this use of System.out by a logger.
(pbo:src/main/java/Donasiku/spring/core/config/DataSeeder.java:98)

189. [CODE_SMELL/MAJOR] Replace this use of System.out by a logger.
(pbo:src/main/java/Donasiku/spring/core/config/DataSeeder.java:99)

190. [CODE_SMELL/MAJOR] Replace this use of System.out by a logger.
(pbo:src/main/java/Donasiku/spring/core/config/DataSeeder.java:100)

191. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/controller/AdminSetupController.java:1)

192. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/controller/AdminSetupController.java:27)

193. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/controller/AdminSetupController.java:30)

194. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/controller/AdminSetupController.java:33)

195. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/AdminSetupController.java:42)

196. [CODE_SMELL/MAJOR] Extract this nested try block into a separate method.
(pbo:src/main/java/Donasiku/spring/core/controller/AdminSetupController.java:46)

197. [CODE_SMELL/MAJOR] Replace this use of System.out by a logger.
(pbo:src/main/java/Donasiku/spring/core/controller/AdminSetupController.java:48)

198. [CODE_SMELL/MAJOR] Replace this use of System.out by a logger.
(pbo:src/main/java/Donasiku/spring/core/controller/AdminSetupController.java:51)

199. [VULNERABILITY/BLOCKER] Revoke and change this password, as it is compromised.
(pbo:src/main/java/Donasiku/spring/core/controller/AdminSetupController.java:62)

200. [CODE_SMELL/MAJOR] Replace this use of System.out by a logger.
(pbo:src/main/java/Donasiku/spring/core/controller/AdminSetupController.java:70)

201. [CODE_SMELL/MAJOR] Replace this use of System.out by a logger.
(pbo:src/main/java/Donasiku/spring/core/controller/AdminSetupController.java:71)

202. [CODE_SMELL/MAJOR] Replace this use of System.out by a logger.
(pbo:src/main/java/Donasiku/spring/core/controller/AdminSetupController.java:72)

203. [CODE_SMELL/MAJOR] Replace this use of System.out by a logger.
(pbo:src/main/java/Donasiku/spring/core/controller/AdminSetupController.java:75)

204. [BUG/MINOR] Use another way to initialize this instance.
(pbo:src/main/java/Donasiku/spring/core/controller/AdminSetupController.java:78)

205. [CODE_SMELL/MAJOR] Move the contents of this initializer to a standard constructor or to field initializers.
(pbo:src/main/java/Donasiku/spring/core/controller/AdminSetupController.java:79)

206. [BUG/MINOR] Use another way to initialize this instance.
(pbo:src/main/java/Donasiku/spring/core/controller/AdminSetupController.java:90)

207. [CODE_SMELL/MAJOR] Move the contents of this initializer to a standard constructor or to field initializers.
(pbo:src/main/java/Donasiku/spring/core/controller/AdminSetupController.java:91)

208. [CODE_SMELL/MAJOR] Replace this use of System.out by a logger.
(pbo:src/main/java/Donasiku/spring/core/controller/VerifikasiController.java:40)

209. [CODE_SMELL/MAJOR] Replace this use of System.out by a logger.
(pbo:src/main/java/Donasiku/spring/core/controller/VerifikasiController.java:41)

210. [CODE_SMELL/MAJOR] Replace this use of System.out by a logger.
(pbo:src/main/java/Donasiku/spring/core/controller/VerifikasiController.java:42)

211. [CODE_SMELL/MAJOR] Replace this use of System.out by a logger.
(pbo:src/main/java/Donasiku/spring/core/controller/VerifikasiController.java:45)

212. [CODE_SMELL/MAJOR] Replace this use of System.err by a logger.
(pbo:src/main/java/Donasiku/spring/core/controller/VerifikasiController.java:48)

213. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/VerifikasiController.java:115)

214. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/VerifikasiController.java:137)

215. [CODE_SMELL/CRITICAL] Rename this constant name to match the regular expression '^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$'.
(pbo:src/main/java/Donasiku/spring/core/entity/User.java:80)

216. [CODE_SMELL/CRITICAL] Rename this constant name to match the regular expression '^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$'.
(pbo:src/main/java/Donasiku/spring/core/entity/User.java:80)

217. [CODE_SMELL/CRITICAL] Rename this constant name to match the regular expression '^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$'.
(pbo:src/main/java/Donasiku/spring/core/entity/User.java:80)

218. [CODE_SMELL/MAJOR] Replace generic exceptions with specific library exceptions or a custom exception.
(pbo:src/main/java/Donasiku/spring/core/service/AuthService.java:81)

219. [CODE_SMELL/MAJOR] Replace this use of System.out by a logger.
(pbo:src/main/java/Donasiku/spring/core/service/VerifikasiService.java:83)

220. [CODE_SMELL/MAJOR] Replace this use of System.out by a logger.
(pbo:src/main/java/Donasiku/spring/core/service/VerifikasiService.java:85)

221. [CODE_SMELL/MAJOR] Replace generic exceptions with specific library exceptions or a custom exception.
(pbo:src/main/java/Donasiku/spring/core/service/VerifikasiService.java:168)

222. [CODE_SMELL/MAJOR] Replace generic exceptions with specific library exceptions or a custom exception.
(pbo:src/main/java/Donasiku/spring/core/service/VerifikasiService.java:173)

223. [CODE_SMELL/MAJOR] Replace this usage of Stream.collect(Collectors.toList()) with Stream.toList() and ensure that the list is unmodified.
(pbo:src/main/java/Donasiku/spring/core/service/VerifikasiService.java:193)

224. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/VerifikasiController.java:37)

225. [CODE_SMELL/MAJOR] Replace generic exceptions with specific library exceptions or a custom exception.
(pbo:src/main/java/Donasiku/spring/core/service/VerifikasiService.java:38)

226. [CODE_SMELL/MAJOR] Replace generic exceptions with specific library exceptions or a custom exception.
(pbo:src/main/java/Donasiku/spring/core/service/VerifikasiService.java:43)

227. [CODE_SMELL/MAJOR] Replace generic exceptions with specific library exceptions or a custom exception.
(pbo:src/main/java/Donasiku/spring/core/service/VerifikasiService.java:47)

228. [CODE_SMELL/MAJOR] Replace generic exceptions with specific library exceptions or a custom exception.
(pbo:src/main/java/Donasiku/spring/core/service/VerifikasiService.java:89)

229. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/controller/VerifikasiController.java:1)

230. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/controller/VerifikasiController.java:22)

231. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/VerifikasiController.java:62)

232. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/VerifikasiController.java:79)

233. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/VerifikasiController.java:96)

234. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/dto/AuthResponse.java:1)

235. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/dto/VerifikasiRequest.java:1)

236. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/dto/VerifikasiResponse.java:1)

237. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/service/VerifikasiService.java:1)

238. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/service/VerifikasiService.java:19)

239. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/service/VerifikasiService.java:22)

240. [CODE_SMELL/MAJOR] Replace generic exceptions with specific library exceptions or a custom exception.
(pbo:src/main/java/Donasiku/spring/core/service/VerifikasiService.java:100)

241. [CODE_SMELL/MAJOR] Replace generic exceptions with specific library exceptions or a custom exception.
(pbo:src/main/java/Donasiku/spring/core/service/VerifikasiService.java:115)

242. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/config/DataSeeder.java:1)

243. [CODE_SMELL/MINOR] Remove this unused "statusDikirim" local variable.
(pbo:src/main/java/Donasiku/spring/core/config/DataSeeder.java:34)

244. [CODE_SMELL/MINOR] Remove this unused "loc" local variable.
(pbo:src/main/java/Donasiku/spring/core/config/DataSeeder.java:70)

245. [CODE_SMELL/MINOR] Remove this unused "donatur" local variable.
(pbo:src/main/java/Donasiku/spring/core/config/DataSeeder.java:106)

246. [CODE_SMELL/CRITICAL] Define a constant instead of duplicating this literal "nauval" 3 times.
(pbo:src/main/java/Donasiku/spring/core/config/DataSeeder.java:108)

247. [VULNERABILITY/BLOCKER] Revoke and change this password, as it is compromised.
(pbo:src/main/java/Donasiku/spring/core/config/DataSeeder.java:112)

248. [VULNERABILITY/BLOCKER] Revoke and change this password, as it is compromised.
(pbo:src/main/java/Donasiku/spring/core/config/DataSeeder.java:127)

249. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/controller/DonasiController.java:1)

250. [CODE_SMELL/MAJOR] Remove this field injection and use constructor injection instead.
(pbo:src/main/java/Donasiku/spring/core/controller/DonasiController.java:20)

251. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/DonasiController.java:56)

252. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/DonasiController.java:82)

253. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/dto/DonasiRequest.java:1)

254. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/dto/StatusUpdateRequest.java:1)

255. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/repository/DonasiRepository.java:1)

256. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/service/DonasiService.java:1)

257. [CODE_SMELL/MAJOR] Replace generic exceptions with specific library exceptions or a custom exception.
(pbo:src/main/java/Donasiku/spring/core/service/PermintaanService.java:116)

258. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/DonasikuBackendApplication.java:1)

259. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/config/SecurityConfig.java:1)

260. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/controller/AuthController.java:1)

261. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/AuthController.java:31)

262. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/AuthController.java:111)

263. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/controller/PermintaanController.java:1)

264. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/PermintaanController.java:152)

265. [CODE_SMELL/CRITICAL] Remove usage of generic wildcard type.
(pbo:src/main/java/Donasiku/spring/core/controller/PermintaanController.java:164)

266. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/dto/LoginRequest.java:1)

267. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/dto/RegisterRequest.java:1)

268. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/entity/Chat.java:1)

269. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/entity/ChatMessage.java:1)

270. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/entity/DokumenVerifikasi.java:1)

271. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/entity/Donasi.java:1)

272. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/entity/Donatur.java:1)

273. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/entity/DonaturRepository.java:1)

274. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/entity/Lokasi.java:1)

275. [CODE_SMELL/CRITICAL] Rename this constant name to match the regular expression '^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$'.
(pbo:src/main/java/Donasiku/spring/core/entity/Lokasi.java:42)

276. [CODE_SMELL/CRITICAL] Rename this constant name to match the regular expression '^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$'.
(pbo:src/main/java/Donasiku/spring/core/entity/Lokasi.java:42)

277. [CODE_SMELL/CRITICAL] Rename this constant name to match the regular expression '^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$'.
(pbo:src/main/java/Donasiku/spring/core/entity/Lokasi.java:42)

278. [CODE_SMELL/CRITICAL] Rename this constant name to match the regular expression '^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$'.
(pbo:src/main/java/Donasiku/spring/core/entity/Lokasi.java:42)

279. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/entity/Penerima.java:1)

280. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/entity/PermintaanDonasi.java:1)

281. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/entity/PermintaanKonfirmasi.java:1)

282. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/entity/StatusDonasi.java:1)

283. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/entity/User.java:1)

284. [CODE_SMELL/CRITICAL] Rename this constant name to match the regular expression '^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$'.
(pbo:src/main/java/Donasiku/spring/core/entity/User.java:84)

285. [CODE_SMELL/CRITICAL] Rename this constant name to match the regular expression '^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$'.
(pbo:src/main/java/Donasiku/spring/core/entity/User.java:84)

286. [CODE_SMELL/CRITICAL] Rename this constant name to match the regular expression '^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$'.
(pbo:src/main/java/Donasiku/spring/core/entity/User.java:84)

287. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/repository/ChatMessageRepository.java:1)

288. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/repository/ChatRepository.java:1)

289. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/repository/DokumenVerifikasiRepository.java:1)

290. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/repository/DonaturRepository.java:1)

291. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/repository/LokasiRepository.java:1)

292. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/repository/PenerimaRepository.java:1)

293. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/repository/PermintaanDonasiRepository.java:1)

294. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/repository/PermintaanKonfirmasiRepository.java:1)

295. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/repository/StatusDonasiRepository.java:1)

296. [CODE_SMELL/MINOR] Rename this package name to match the regular expression '^[a-z_]+(\.[a-z_][a-z0-9_]*)*$'.
(pbo:src/main/java/Donasiku/spring/core/repository/UserRepository.java:1)


## 🧪 Test Coverage
- **0% coverage**
- Belum terdapat unit test
- Disarankan menggunakan:
  - JUnit
  - Mockito
  - Spring Boot Test

---

## 📝 Kesimpulan
- Project **lulus Quality Gate**
- Masih perlu perbaikan signifikan pada:
  - Maintainability
  - Security
  - Test coverage
- Hasil ini menunjukkan pentingnya static analysis untuk meningkatkan kualitas kode sejak dini.

---

📌 *Dokumentasi ini dibuat secara otomatis berdasarkan hasil analisis SonarQube.*
