
import authService from '../services/auth.service.js'

async function register(c) {
  try {
    const data = c.req.valid('json')
    console.log("REGISTER DATA:", data);
     await authService.register(data)
    return c.json({
      message: 'Registration successful. Please check your email for verification.'
    }, 201)
  
  } catch (error) {
    // console.error(error)
    console.error("REGISTER ERROR:", error);
    return c.json({ error: 'Registration failed' }, 400)
  }
}

async function login(c) {
  try {
    const { email, password } = c.req.valid('json')
    const token = await authService.login(email, password)

    return c.json({ message: 'Login successful', token })
  } catch (error) {
    console.log("error:", error.message)

    return c.json({ error: error.message }, 401)
  }
}


async function forgotPassword(c) {
  try {
    const { email } = c.req.valid('json')
    await authService.forgotPassword(email)
    return c.json({
      message: 'Password reset instructions sent to your email'
    })
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Password reset request failed' }, 400)
  }
}

async function sendVerification(c) {
  try {
    const { email } = c.req.valid('json')
    await authService.sendEmailVerification(email)
    return c.json({
      message: 'Veification Email Sent'
    })
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Verification email couldnt be sent' }, 400)
  }
}

async function resetPassword(c) {
  try {
    const { token, password } = c.req.valid('json')
    await authService.resetPassword(token, password)
    return c.json({ message: 'Password successfully reset' })
  } catch (error) {
    console.error("error:", error)
    return c.json({ error: 'Password reset failed' }, 400)
  }
}

async function verifyUserEmail(c) {

  try {
    const token = c.req.param('token')
    console.log("token:", token)
    await authService.verifyEmail(token)
    return c.json({ message: 'Email verified successfully' })
  } catch (error) {
    console.log("error:", error)
    return c.json({ error: 'Email verification failed' }, 400)
  }
}

export { register, verifyUserEmail, resetPassword, forgotPassword, login, sendVerification }

