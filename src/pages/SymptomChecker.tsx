import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Stethoscope, 
  Search, 
  ThermometerSun, 
  Heart, 
  Brain, 
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone
} from 'lucide-react';

const SymptomChecker: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'symptoms' | 'questions' | 'results'>('symptoms');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [additionalInfo, setAdditionalInfo] = useState<string>('');

  const commonSymptoms = [
    { id: 'fever', name: 'Fever', icon: ThermometerSun, category: 'general' },
    { id: 'headache', name: 'Headache', icon: Brain, category: 'head' },
    { id: 'chest-pain', name: 'Chest Pain', icon: Heart, category: 'chest' },
    { id: 'fatigue', name: 'Fatigue', icon: Zap, category: 'general' },
    { id: 'cough', name: 'Cough', icon: ThermometerSun, category: 'respiratory' },
    { id: 'nausea', name: 'Nausea', icon: ThermometerSun, category: 'digestive' },
    { id: 'dizziness', name: 'Dizziness', icon: Brain, category: 'head' },
    { id: 'back-pain', name: 'Back Pain', icon: Zap, category: 'musculoskeletal' }
  ];

  const mockResults = {
    condition: 'Common Cold',
    confidence: 85,
    triage: 'yellow', // green, yellow, red
    description: 'Based on your symptoms, you may have a common cold. This is typically a mild viral infection.',
    recommendations: [
      'Get plenty of rest',
      'Stay hydrated',
      'Use over-the-counter pain relievers if needed',
      'Monitor your symptoms'
    ],
    whenToSeekCare: [
      'Symptoms worsen after 7 days',
      'High fever (over 101.3°F)',
      'Difficulty breathing',
      'Severe headache or sinus pain'
    ]
  };

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId) 
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const analyzeSymptoms = () => {
    setCurrentStep('results');
  };

  const getTriageColor = (triage: string) => {
    switch (triage) {
      case 'green': return 'text-medical-success';
      case 'yellow': return 'text-medical-warning';
      case 'red': return 'text-medical-error';
      default: return 'text-muted-foreground';
    }
  };

  const getTriageIcon = (triage: string) => {
    switch (triage) {
      case 'green': return CheckCircle;
      case 'yellow': return Clock;
      case 'red': return AlertTriangle;
      default: return CheckCircle;
    }
  };

  const filteredSymptoms = commonSymptoms.filter(symptom =>
    symptom.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-6 py-8 max-w-4xl">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-hero flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">AI Symptom Checker</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get preliminary health insights based on your symptoms. This is not a substitute for professional medical advice.
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {currentStep === 'symptoms' ? 'Step 1 of 2' : 'Step 2 of 2'}
              </span>
            </div>
            <Progress 
              value={currentStep === 'symptoms' ? 50 : 100} 
              className="h-2"
            />
          </CardContent>
        </Card>

        {/* Symptom Selection */}
        {currentStep === 'symptoms' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Your Symptoms</CardTitle>
                <CardDescription>
                  Choose all symptoms you're currently experiencing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search symptoms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredSymptoms.map((symptom) => {
                    const isSelected = selectedSymptoms.includes(symptom.id);
                    return (
                      <Card
                        key={symptom.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-medium ${
                          isSelected ? 'ring-2 ring-medical-primary bg-medical-primary/5' : ''
                        }`}
                        onClick={() => toggleSymptom(symptom.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              isSelected ? 'bg-medical-primary text-white' : 'bg-surface-elevated'
                            }`}>
                              <symptom.icon className="h-5 w-5" />
                            </div>
                            <span className="font-medium">{symptom.name}</span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {selectedSymptoms.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium mb-3">Selected Symptoms:</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSymptoms.map((symptomId) => {
                        const symptom = commonSymptoms.find(s => s.id === symptomId);
                        return (
                          <Badge key={symptomId} variant="secondary">
                            {symptom?.name}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>
                  Describe your symptoms in more detail (optional)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="When did symptoms start? How severe are they? Any other relevant details..."
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" asChild>
                <a href="/dashboard/patient">Back to Dashboard</a>
              </Button>
              <Button 
                variant="medical" 
                onClick={analyzeSymptoms}
                disabled={selectedSymptoms.length === 0}
              >
                Analyze Symptoms
              </Button>
            </div>
          </div>
        )}

        {/* Results */}
        {currentStep === 'results' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    mockResults.triage === 'green' ? 'bg-medical-success/10' :
                    mockResults.triage === 'yellow' ? 'bg-medical-warning/10' :
                    'bg-medical-error/10'
                  }`}>
                    {React.createElement(getTriageIcon(mockResults.triage), {
                      className: `h-5 w-5 ${getTriageColor(mockResults.triage)}`
                    })}
                  </div>
                  Preliminary Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{mockResults.condition}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-muted-foreground">Confidence:</span>
                      <Progress value={mockResults.confidence} className="w-24 h-2" />
                      <span className="text-sm font-medium">{mockResults.confidence}%</span>
                    </div>
                    <p className="text-muted-foreground">{mockResults.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {mockResults.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-medical-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">When to Seek Care</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {mockResults.whenToSeekCare.map((warning, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-medical-warning mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{warning}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="border-medical-primary/30 bg-medical-primary/5">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-semibold">Need Professional Care?</h3>
                  <p className="text-sm text-muted-foreground">
                    This assessment is for informational purposes only. Consult a healthcare professional for proper diagnosis.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button variant="medical" asChild>
                      <a href="/consult">Book Consultation</a>
                    </Button>
                    <Button variant="destructive" asChild>
                      <a href="tel:102">
                        <Phone className="h-4 w-4 mr-2" />
                        Emergency Call
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep('symptoms')}>
                Start Over
              </Button>
              <Button variant="outline" asChild>
                <a href="/dashboard/patient">Back to Dashboard</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomChecker;