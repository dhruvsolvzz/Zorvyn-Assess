import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiArrowRight, FiShield, FiTrendingUp } from 'react-icons/fi';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { PageTransition } from '../components/PageTransition';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { signIn, signUp, signInAsRole } = useStore();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate('/dashboard');
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFastLogin = (role) => {
    signInAsRole(role);
    navigate('/dashboard');
  };

  return (
    <PageTransition>
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 border-border/40 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden relative">
            {/* Decorative background elements */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
            
            <div className="relative space-y-8">
              <div className="text-center space-y-2">
                <motion.div 
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  className="inline-flex p-3 rounded-2xl bg-primary/10 mb-2"
                >
                  <FiShield className="w-8 h-8 text-primary" />
                </motion.div>
                <h1 className="text-3xl font-black tracking-tight">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest">
                  Secure access to your finance vault
                </p>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-1"
                    >
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Full Name</label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-background/50 border border-border/50 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-background/50 border border-border/50 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-background/50 border border-border/50 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {error && (
                  <motion.p 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="text-xs font-bold text-rose-500 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20"
                  >
                    {error}
                  </motion.p>
                )}

                <Button
                  disabled={loading}
                  className="w-full py-6 rounded-xl font-bold gap-2 group shadow-xl shadow-primary/20"
                  style={{
                    background: 'linear-gradient(135deg, #6366F1, #818CF8)',
                  }}
                >
                  <span>{loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Vault'}</span>
                  {!loading && <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </Button>

                <div className="pt-4 space-y-3">
                  <div className="relative flex items-center gap-2 text-muted-foreground py-2">
                    <div className="h-px w-full bg-border/40" />
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-card px-2 whitespace-nowrap">Fast Access</span>
                    <div className="h-px w-full bg-border/40" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => handleFastLogin('admin')}
                      className="rounded-xl border-rose-500/20 hover:bg-rose-500/10 hover:text-rose-500 group h-auto py-3"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <FiShield className="size-4 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase">Admin</span>
                      </div>
                    </Button>
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => handleFastLogin('viewer')}
                      className="rounded-xl border-blue-500/20 hover:bg-blue-500/10 hover:text-blue-500 group h-auto py-3"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <FiUser className="size-4 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase">User</span>
                      </div>
                    </Button>
                  </div>
                </div>
              </form>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
                </button>
              </div>
            </div>
          </Card>
          
          <div className="mt-8 flex justify-center items-center gap-6 text-muted-foreground grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            <div className="flex items-center gap-2">
              <FiShield className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <FiTrendingUp className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Real-time</span>
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
