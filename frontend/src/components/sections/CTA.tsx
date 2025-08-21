import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function CTA() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="p-16 text-center bg-gradient-to-br from-white to-purple-50/50">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to get started?
            </h2>
            
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Join thousands of educators and learners who are already creating 
              amazing quizzes with PromptPlay.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/signup">
                <Button size="lg" className="group">
                  Start your journey
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Button variant="outline" size="lg">
                Contact sales
              </Button>
            </div>

            <p className="text-sm text-gray-500 mt-8">
              No credit card required • Free forever plan • Cancel anytime
            </p>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}