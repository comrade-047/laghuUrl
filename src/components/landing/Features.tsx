import { BarChart3, Share2, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: <Zap size={32} className="text-indigo-500" />,
    title: "Lightning Fast",
    description: "Our redirects are blazingly fast, ensuring your users never wait.",
  },
  {
    icon: <BarChart3 size={32} className="text-indigo-500" />,
    title: "Click Analytics",
    description: "Track how many clicks your shortened links receive easily.",
  },
  {
    icon: <Share2 size={32} className="text-indigo-500" />,
    title: "Easy to Share",
    description: "Create memorable links perfect for sharing across platforms.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Everything You Need, Nothing You Don&apos;t
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            A feature-rich URL shortener designed for performance and ease of use.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-6 text-center hover:shadow-lg transition-transform transform hover:-translate-y-1"
            >
              <CardHeader className="mb-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                  {feature.icon}
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </CardTitle>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
