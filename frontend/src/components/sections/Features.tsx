import { motion } from 'framer-motion';
import { 
  Brain, Zap, Users, Trophy, BarChart3, Globe, ArrowRight, CheckCircle, 
  Sparkles, Star, Lightbulb, Rocket
} from 'lucide-react';

const mainFeatures = [
  {
    icon: Brain,
    title: 'AI-Powered Creation',
    description: 'Generate comprehensive quizzes from any topic using advanced AI technology that understands context and creates engaging questions.',
    color: 'purple',
    stats: '10M+ quizzes generated',
    benefits: [
      'Natural language processing',
      'Context-aware questions',
      'Multiple difficulty levels',
      'Instant generation'
    ]
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Create and deploy quizzes in under 30 seconds. No manual work required - just describe your topic and watch the magic happen.',
    color: 'emerald',
    stats: '< 30 seconds average',
    benefits: [
      'Instant quiz creation',
      'Real-time processing',
      'Zero setup required',
      'One-click deployment'
    ]
  },
  {
    icon: Users,
    title: 'Real-Time Multiplayer',
    description: 'Compete with friends in live quiz battles with instant scoring, real-time leaderboards, and engaging multiplayer experiences.',
    color: 'purple',
    stats: '500K+ active players',
    benefits: [
      'Live competitions',
      'Real-time scoring',
      'Global leaderboards',
      'Social challenges'
    ]
  }
];

const secondaryFeatures = [
  {
    icon: Trophy,
    title: 'Gamification System',
    description: 'Earn points, unlock achievements, and climb global leaderboards.',
    benefits: ['Achievement badges', 'Point rewards', 'Progress tracking', 'Skill levels']
  },
  {
    icon: BarChart3,
    title: 'Smart Analytics',
    description: 'Get detailed insights into performance and learning patterns.',
    benefits: ['Performance metrics', 'Learning analytics', 'Progress reports', 'Trend analysis']
  },
  {
    icon: Globe,
    title: 'Global Community',
    description: 'Join millions of learners and discover quizzes in every subject.',
    benefits: ['Community sharing', 'Subject variety', 'Social features', 'Expert content']
  }
];

export default function Features() {
  return (
    <section id="features" className="py-32 px-6 bg-gradient-to-b from-white via-purple-50/30 to-emerald-50/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-emerald-100 text-purple-700 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Powerful Features
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Everything you need to
            <span className="block bg-gradient-to-r from-purple-600 to-emerald-600 bg-clip-text text-transparent">
              create amazing quizzes
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From AI-powered generation to real-time competitions, we've built the complete platform for modern quiz creation and engagement.
          </p>
        </motion.div>

        {/* Main Features - Alternating Layout */}
        <div className="space-y-32 mb-32">
          {mainFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`flex flex-col lg:flex-row items-center gap-16 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Content */}
              <div className="flex-1 space-y-8">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    feature.color === 'purple' 
                      ? 'bg-gradient-to-br from-purple-500 to-purple-600' 
                      : 'bg-gradient-to-br from-emerald-500 to-emerald-600'
                  }`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    feature.color === 'purple'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {feature.stats}
                  </div>
                </div>
                
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {feature.title}
                </h3>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className={`w-4 h-4 mr-2 flex-shrink-0 ${
                        feature.color === 'purple' ? 'text-purple-500' : 'text-emerald-500'
                      }`} />
                      {benefit}
                    </div>
                  ))}
                </div>
                
                <button className={`inline-flex items-center text-lg font-medium group ${
                  feature.color === 'purple' ? 'text-purple-600' : 'text-emerald-600'
                }`}>
                  Learn more
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Visual */}
              <div className="flex-1">
                <div className={`relative p-8 rounded-3xl ${
                  feature.color === 'purple'
                    ? 'bg-gradient-to-br from-purple-50 to-purple-100'
                    : 'bg-gradient-to-br from-emerald-50 to-emerald-100'
                }`}>
                  <div className="aspect-square bg-white rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <feature.icon className={`w-24 h-24 ${
                      feature.color === 'purple' ? 'text-purple-600' : 'text-emerald-600'
                    }`} />
                  </div>
                  
                  {/* Floating elements */}
                  <motion.div 
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className={`absolute -top-4 -right-4 w-8 h-8 rounded-full ${
                      feature.color === 'purple' ? 'bg-purple-500' : 'bg-emerald-500'
                    } flex items-center justify-center`}
                  >
                    <Star className="w-4 h-4 text-white" />
                  </motion.div>
                  
                  <motion.div 
                    animate={{ y: [5, -5, 5] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                    className={`absolute -bottom-4 -left-4 w-12 h-12 rounded-full ${
                      feature.color === 'purple' ? 'bg-emerald-500' : 'bg-purple-500'
                    } flex items-center justify-center`}
                  >
                    <Lightbulb className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Secondary Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Plus everything else you need
            </h3>
            <p className="text-lg text-gray-600">
              Comprehensive tools for the complete quiz experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {secondaryFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-emerald-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-purple-600" />
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h4>
                  
                  <p className="text-gray-600 mb-6">
                    {feature.description}
                  </p>
                  
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center text-sm text-gray-500">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-600 via-purple-700 to-emerald-600 rounded-3xl p-12 text-white text-center"
        >
          <div className="flex items-center justify-center mb-8">
            <Rocket className="w-8 h-8 mr-3" />
            <h3 className="text-3xl font-bold">Trusted by creators worldwide</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">10M+</div>
              <div className="text-purple-100">Quizzes Created</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500K+</div>
              <div className="text-purple-100">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50M+</div>
              <div className="text-purple-100">Questions Answered</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-purple-100">Uptime</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}