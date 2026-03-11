import SwiftUI

struct AuthContainerView: View {
    @State private var isLogin = true
    
    var body: some View {
        NavigationStack {
            ZStack {
                LinearGradient(colors: [Color(red: 0.39, green: 0.4, blue: 0.95), Color(red: 0.55, green: 0.36, blue: 0.96)], startPoint: .topLeading, endPoint: .bottomTrailing)
                    .ignoresSafeArea()
                
                VStack(spacing: 24) {
                    Text("MindGlow")
                        .font(.largeTitle.bold())
                        .foregroundColor(.white)
                    Text("Wellness & Meditation")
                        .font(.subheadline)
                        .foregroundColor(.white.opacity(0.9))
                    
                    if isLogin {
                        LoginView()
                    } else {
                        SignUpView()
                    }
                    
                    Button {
                        isLogin.toggle()
                    } label: {
                        Text(isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in")
                            .font(.subheadline)
                            .foregroundColor(.white)
                    }
                    .padding(.top, 8)
                }
                .padding()
            }
        }
    }
}

struct LoginView: View {
    @EnvironmentObject var auth: AuthViewModel
    @State private var email = ""
    @State private var password = ""
    @State private var showForgotPassword = false
    @State private var resetEmail = ""
    
    var body: some View {
        VStack(spacing: 16) {
            TextField("Email", text: $email)
                .textContentType(.emailAddress)
                .keyboardType(.emailAddress)
                .autocapitalization(.none)
                .padding()
                .background(Color.white.opacity(0.2))
                .cornerRadius(12)
                .foregroundColor(.white)
            
            SecureField("Password", text: $password)
                .textContentType(.password)
                .padding()
                .background(Color.white.opacity(0.2))
                .cornerRadius(12)
                .foregroundColor(.white)
            
            if let err = auth.errorMessage {
                Text(err)
                    .font(.caption)
                    .foregroundColor(.yellow)
            }
            
            Button("Forgot password?") {
                showForgotPassword = true
            }
            .font(.caption)
            .foregroundColor(.white.opacity(0.9))
            
            Button {
                Task { await auth.signIn(email: email, password: password) }
            } label: {
                Text("Log In")
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.white)
                    .foregroundColor(Color(red: 0.39, green: 0.4, blue: 0.95))
                    .cornerRadius(12)
            }
            .disabled(email.isEmpty || password.isEmpty)
        }
        .padding(.horizontal, 24)
        .sheet(isPresented: $showForgotPassword) {
            ForgotPasswordView(resetEmail: $resetEmail) {
                Task { await auth.resetPassword(email: resetEmail) }
                showForgotPassword = false
            }
        }
    }
}

struct SignUpView: View {
    @EnvironmentObject var auth: AuthViewModel
    @State private var name = ""
    @State private var email = ""
    @State private var password = ""
    
    var body: some View {
        VStack(spacing: 16) {
            TextField("Name", text: $name)
                .textContentType(.name)
                .padding()
                .background(Color.white.opacity(0.2))
                .cornerRadius(12)
                .foregroundColor(.white)
            
            TextField("Email", text: $email)
                .textContentType(.emailAddress)
                .keyboardType(.emailAddress)
                .autocapitalization(.none)
                .padding()
                .background(Color.white.opacity(0.2))
                .cornerRadius(12)
                .foregroundColor(.white)
            
            SecureField("Password", text: $password)
                .textContentType(.newPassword)
                .padding()
                .background(Color.white.opacity(0.2))
                .cornerRadius(12)
                .foregroundColor(.white)
            
            if let err = auth.errorMessage {
                Text(err)
                    .font(.caption)
                    .foregroundColor(.yellow)
            }
            
            Button {
                Task { await auth.signUp(name: name, email: email, password: password) }
            } label: {
                Text("Sign Up")
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.white)
                    .foregroundColor(Color(red: 0.39, green: 0.4, blue: 0.95))
                    .cornerRadius(12)
            }
            .disabled(name.isEmpty || email.isEmpty || password.count < 6)
        }
        .padding(.horizontal, 24)
    }
}

struct ForgotPasswordView: View {
    @Binding var resetEmail: String
    let onSend: () -> Void
    
    var body: some View {
        NavigationStack {
            VStack(spacing: 16) {
                TextField("Email", text: $resetEmail)
                    .textContentType(.emailAddress)
                    .keyboardType(.emailAddress)
                    .padding()
                    .background(Color(.systemGray6))
                    .cornerRadius(12)
                Button("Send reset link", action: onSend)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color(red: 0.39, green: 0.4, blue: 0.95))
                    .foregroundColor(.white)
                    .cornerRadius(12)
            }
            .padding()
            .navigationTitle("Reset password")
        }
    }
}
