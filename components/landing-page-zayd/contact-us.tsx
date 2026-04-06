import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { contactService, ContactUserType } from '@/lib/services/contactService';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import Navbar from './navbar-new';
import Footer from './footer-new';
import { ReactLenis } from '@/components/lenis';
import { LanguageProvider, useLanguage } from '@/components/language-provider';
import falconContactPage from '@/assets/landingpage-zayd/falcon-contactpage.svg';

const contactFormSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(255, 'First name must not exceed 255 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(255, 'Last name must not exceed 255 characters'),
  age: z
    .number()
    .min(1, 'Age must be at least 1')
    .max(120, 'Age must be at most 120'),
  userType: z.nativeEnum(ContactUserType, {
    errorMap: () => ({ message: 'Please select a user type' }),
  }),
  email: z.string().email('Email must be a valid email address'),
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\+?\d{7,15}$/, 'Phone number must be 7-15 digits. International format with + is preferred.'),
  hearAboutUs: z
    .string()
    .min(1, 'Please tell us how you heard about us')
    .max(255, 'Must not exceed 255 characters'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactUs() {
  return (
    <LanguageProvider>
      <ContactUsPage />
    </LanguageProvider>
  );
}

function ContactUsPage() {
  const { language } = useLanguage();
  const direction = language === 'ar' ? 'rtl' : 'ltr';
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      age: undefined,
      userType: undefined,
      email: '',
      phoneNumber: '',
      hearAboutUs: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const submissionData = {
        ...data,
        age: Math.floor(Number(data.age)),
      };

      await contactService.submitContact(submissionData);
      form.reset();
      setShowSuccessModal(true);
    } catch (error: unknown) {
      const axiosError = error as {
        response?: {
          data?: {
            message?: string | string[];
            errors?: Array<{
              property?: string;
              constraints?: Record<string, string>;
              value?: unknown;
            }>;
          };
          status?: number;
        };
        message?: string;
      };

      const responseData = axiosError.response?.data;

      if (responseData?.errors && Array.isArray(responseData.errors)) {
        responseData.errors.forEach((err: { property?: string; constraints?: Record<string, string> }) => {
          if (err.property) {
            const fieldName = err.property as keyof ContactFormValues;
            const errorMessage = Object.values(err.constraints || {})[0] || 'Invalid value';
            form.setError(fieldName, {
              message: errorMessage,
            });
          }
        });
      } else if (responseData && Array.isArray(responseData.message)) {
        responseData.message.forEach((msg: string) => {
          let fieldName: keyof ContactFormValues | null = null;

          if (msg.toLowerCase().includes('phone')) {
            fieldName = 'phoneNumber';
          } else if (msg.toLowerCase().includes('email')) {
            fieldName = 'email';
          } else if (msg.toLowerCase().includes('first name') || msg.toLowerCase().includes('firstName')) {
            fieldName = 'firstName';
          } else if (msg.toLowerCase().includes('last name') || msg.toLowerCase().includes('lastName')) {
            fieldName = 'lastName';
          } else if (msg.toLowerCase().includes('age')) {
            fieldName = 'age';
          } else if (msg.toLowerCase().includes('user type') || msg.toLowerCase().includes('userType')) {
            fieldName = 'userType';
          } else if (msg.toLowerCase().includes('hear about') || msg.toLowerCase().includes('hearAboutUs')) {
            fieldName = 'hearAboutUs';
          } else {
            const fieldMatch = msg.match(/(\w+) (is|must|should)/i);
            if (fieldMatch) {
              const extracted = fieldMatch[1].charAt(0).toLowerCase() + fieldMatch[1].slice(1);
              if (extracted in form.getValues()) {
                fieldName = extracted as keyof ContactFormValues;
              }
            }
          }

          if (fieldName) {
            form.setError(fieldName, { message: msg });
          }
        });
      }

      let errorMessage = 'Failed to send message. Please try again.';
      if (responseData) {
        if (Array.isArray(responseData.message)) {
          errorMessage = responseData.message.join(', ');
        } else if (typeof responseData.message === 'string') {
          errorMessage = responseData.message;
        } else if (responseData.message === 'Validation failed' && responseData.errors) {
          errorMessage = 'Please check the form fields and try again.';
        }
      } else if (axiosError.message) {
        errorMessage = axiosError.message;
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        .gradient-hover-animate {
          background: linear-gradient(to right, #3EA4F9 0%, #0267B5 50%, #3EA4F9 100%);
          background-size: 200% 100%;
          background-position: 0% 50%;
          transition: background-position 0.6s ease;
        }
        .gradient-hover-animate:hover {
          background-position: 100% 50%;
        }
      `}</style>
      <ReactLenis
        root
        options={{
          lerp: 0.05,
          smoothWheel: true,
          duration: 1.2,
          wheelMultiplier: 1.2,
          touchMultiplier: 1.2,
          syncTouch: true,
        }}
      >
        <div
          className="min-h-screen font-geist-sans bg-white"
          dir={direction}
          lang={language}
        >
        <Navbar />
        <section className="relative py-12 sm:py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            {/* Header Section */}
            <div className="text-center mb-16">
              <motion.div
                className="inline-block bg-white border border-gray-300 rounded-full px-6 py-2 mb-6 shadow-sm"
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <p className="text-gray-600 text-sm font-medium">
                  {language === "ar" ? "تواصل معنا" : "Get in touch"}
                </p>
              </motion.div>

              <motion.div
                className="relative flex items-center justify-center mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
              >
                <h1 className="text-5xl md:text-6xl font-bold">
                  {language === "ar" ? (
                    <>
                      <motion.span
                        className="bg-gradient-to-r from-[#76ABF8] via-[#058BF4] to-[#63B3F6] bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                      >
                        تواصل
                      </motion.span>{" "}
                      <motion.span
                        className="text-gray-900"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
                      >
                        معنا
                      </motion.span>
                    </>
                  ) : (
                    <>
                      <motion.span
                        className="bg-gradient-to-r from-[#76ABF8] via-[#058BF4] to-[#63B3F6] bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                      >
                        Contact
                      </motion.span>{" "}
                      <motion.span
                        className="text-gray-900"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
                      >
                        Us
                      </motion.span>
                    </>
                  )}
                </h1>
              </motion.div>

              <motion.p
                className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
              >
                {language === "ar" 
                  ? "لديك سؤال أو تريد معرفة المزيد؟ نحن هنا لمساعدتك. املأ النموذج أدناه وسنعاود الاتصال بك في أقرب وقت ممكن."
                  : "Have a question or want to learn more? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible."}
              </motion.p>
            </div>

            {/* Form Card with Bird Overlay */}
            <div className="relative mt-12 md:mt-16 lg:mt-20">
              {/* Bird Image - Positioned above form*/}
            <motion.div
                className="absolute right-0 -top-[80px] md:-top-[120px] lg:-top-[150px] w-[150px] md:w-[250px] lg:w-[300px] h-auto z-0"
                initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  duration: 0.8,
                  delay: 2.3,
                  ease: "easeOut"
                }}
            >
              <img
                  src={falconContactPage}
                alt="Falcon"
                  className="w-full h-auto"
              />
            </motion.div>

            {/* Form Card */}
            <motion.div
                className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 md:p-12 relative z-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
            >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Name Fields - Two Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{language === "ar" ? "الاسم الأول *" : "First Name *"}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={language === "ar" ? "محمد" : "John"}
                              {...field}
                              className="h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                  >
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{language === "ar" ? "اسم العائلة *" : "Last Name *"}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={language === "ar" ? "أحمد" : "Doe"}
                              {...field}
                              className="h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </div>

                {/* Age and User Type - Two Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                  >
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{language === "ar" ? "العمر *" : "Age *"}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="25"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? parseInt(e.target.value, 10)
                                    : undefined
                                )
                              }
                              className="h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.1 }}
                  >
                    <FormField
                      control={form.control}
                      name="userType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{language === "ar" ? "أنا *" : "I am a *"}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder={language === "ar" ? "اختر نوع المستخدم" : "Select user type"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={ContactUserType.Student}>
                                {language === "ar" ? "طالب" : "Student"}
                              </SelectItem>
                              <SelectItem value={ContactUserType.Parent}>
                                {language === "ar" ? "ولي أمر" : "Parent"}
                              </SelectItem>
                              <SelectItem value={ContactUserType.Organization}>
                                {language === "ar" ? "منظمة" : "Organization"}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </div>

                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{language === "ar" ? "البريد الإلكتروني *" : "Email Address *"}</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder={language === "ar" ? "example@email.com" : "john.doe@example.com"}
                            {...field}
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Phone */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.3 }}
                >
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{language === "ar" ? "رقم الهاتف *" : "Phone Number *"}</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder={language === "ar" ? "+966501234567" : "+1234567890"}
                            {...field}
                            className="h-11"
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-gray-500">
                          {language === "ar" 
                            ? "يجب أن يكون الرقم من 7-15 رقم. الصيغة الدولية مع + مفضلة (مثال: +966501234567)"
                            : "Must be 7-15 digits. International format with + is preferred (e.g., +1234567890 or 1234567890)"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* How did you hear about us */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                >
                  <FormField
                    control={form.control}
                    name="hearAboutUs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{language === "ar" ? "كيف سمعت عنا؟ *" : "How did you hear about us? *"}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={language === "ar" ? "أخبرنا كيف اكتشفت منصتنا..." : "Tell us how you discovered our platform..."}
                            {...field}
                            className="min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  className="pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex justify-center">
                      <Button
                        type="submit"
                        className="gradient-hover-animate w-[60%] rounded-2xl h-14 text-white font-semibold text-lg flex items-center justify-center"
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? language === "ar"
                            ? "جاري الإرسال..."
                            : "Submitting..."
                          : language === "ar"
                          ? "إرسال"
                          : "Submit"}
                      </Button>
                    </div>
                  </motion.div>
                </motion.div>
              </form>
            </Form>
            </motion.div>
            </div>
          </div>
        </section>
        <Footer />
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 bg-transparent shadow-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative bg-white rounded-2xl p-8 md:p-10 shadow-2xl"
          >
            {/* Success Icon with Animation */}
            <motion.div
              className="flex justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
            >
              <motion.div
                className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeInOut",
                  delay: 0.4,
                }}
              >
                <motion.svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.6,
                    ease: "easeInOut",
                  }}
                >
                  <motion.path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.6,
                      ease: "easeInOut",
                    }}
                  />
                </motion.svg>
              </motion.div>
            </motion.div>

            {/* Message */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <motion.h3
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                {language === "ar" ? "شكراً لك!" : "Thank You!"}
              </motion.h3>
              <motion.p
                className="text-lg text-gray-600 mb-6 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                {language === "ar" 
                  ? "سنواصل التواصل معك قريباً"
                  : "We will contact you shortly"}
              </motion.p>
            </motion.div>

            {/* Close Button */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => setShowSuccessModal(false)}
                  className="gradient-hover-animate w-[110%] -mx-[5%] rounded-2xl h-14 text-white font-semibold text-lg flex items-center justify-center"
                >
                  {language === "ar" ? "حسناً" : "Got it"}
                </Button>
              </motion.div>
            </motion.div>

            {/* Decorative Elements */}
            <motion.div
              className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-bl-full opacity-50"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.5, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-100 to-transparent rounded-tr-full opacity-50"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.5, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            />
          </motion.div>
        </DialogContent>
        </Dialog>
      </ReactLenis>
    </>
  );
}
