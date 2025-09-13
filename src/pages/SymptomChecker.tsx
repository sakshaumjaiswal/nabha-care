import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Stethoscope, Zap, AlertTriangle, CheckCircle, Clock, Phone, Loader2, FileText, ArrowLeft, Search, Brain, ThermometerSun
} from 'lucide-react';

// Types
interface Symptom {
  id: string;
  name: string;
  parent_symptom_id: string | null;
  question_prompt: string | null;
}
interface ConditionResult {
  condition: {
    id: string;
    name: string;
    description: string;
    triage_level: 'green' | 'yellow' | 'red';
    recommendations: string[];
    when_to_seek_care: string[];
  };
  confidence: number;
}

// Helper to provide icons for symptoms (expand as needed)
const getSymptomIcon = (symptomName: string) => {
    const name = symptomName.toLowerCase();
    if (name.includes('headache')) return Brain;
    if (name.includes('fever')) return ThermometerSun;
    if (name.includes('cough')) return Stethoscope; // Placeholder, find a better one if available
    return Zap; // Default icon
};


const SymptomChecker: React.FC = () => {
  const [step, setStep] = useState<'initial' | 'questions' | 'results'>('initial');
  const [allSymptoms, setAllSymptoms] = useState<Symptom[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Map<string, Symptom>>(new Map());
  const [currentQuestion, setCurrentQuestion] = useState<Symptom | null>(null);
  const [questionsQueue, setQuestionsQueue] = useState<Symptom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ConditionResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState(''); // For the UI
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    const fetchSymptoms = async () => {
      const { data, error } = await supabase.from('symptoms').select('*');
      if (error) {
        toast({ title: "Error", description: "Could not load symptoms.", variant: "destructive" });
      } else {
        setAllSymptoms(data || []);
      }
      setIsLoading(false);
    };
    fetchSymptoms();
  }, [toast]);

  const primarySymptoms = allSymptoms.filter(s => s.parent_symptom_id === null && s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handlePrimarySelect = (symptom: Symptom) => {
    const newSelected = new Map(selectedSymptoms);
    if (newSelected.has(symptom.id)) {
      newSelected.delete(symptom.id);
    } else {
      newSelected.set(symptom.id, symptom);
    }
    setSelectedSymptoms(newSelected);
  };

  const startQuestioning = () => {
    const queue = Array.from(selectedSymptoms.values()).filter(s => s.question_prompt);
    setQuestionsQueue(queue);
    if (queue.length > 0) {
      setCurrentQuestion(queue[0]);
      setStep('questions');
    } else {
      analyzeSymptoms();
    }
  };
  
  const handleAnswerSelect = (answer: Symptom) => {
      const newSelected = new Map(selectedSymptoms);
      newSelected.set(answer.id, answer);
      if (answer.parent_symptom_id) {
          newSelected.delete(answer.parent_symptom_id);
      }
      setSelectedSymptoms(newSelected);

      const nextQueue = questionsQueue.slice(1);
      setQuestionsQueue(nextQueue);
      if (nextQueue.length > 0) {
          setCurrentQuestion(nextQueue[0]);
      } else {
          setCurrentQuestion(null);
          analyzeSymptoms(Array.from(newSelected.keys()));
      }
  };

  const analyzeSymptoms = async (finalSymptomIds?: string[]) => {
    setIsLoading(true);
    setStep('results');
    const symptomIdsToAnalyze = finalSymptomIds || Array.from(selectedSymptoms.keys());

    try {
      const { data, error } = await supabase.functions.invoke('symptom-analyzer', {
        body: { symptomIds: symptomIdsToAnalyze },
      });
      if (error) throw error;
      setResults(data);
    } catch (error: any) {
      toast({ title: "Analysis Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetChecker = () => {
    setSelectedSymptoms(new Map());
    setResults([]);
    setStep('initial');
    setCurrentQuestion(null);
    setQuestionsQueue([]);
    setSearchQuery('');
    setAdditionalInfo('');
  };

  const getTriageInfo = (level: string) => {
    switch (level) {
      case 'green': return { color: 'text-medical-success', icon: CheckCircle, bgColor: 'bg-medical-success/10', borderColor: 'border-medical-success' };
      case 'yellow': return { color: 'text-medical-warning', icon: Clock, bgColor: 'bg-medical-warning/10', borderColor: 'border-medical-warning' };
      case 'red': return { color: 'text-medical-error', icon: AlertTriangle, bgColor: 'bg-medical-error/10', borderColor: 'border-medical-error' };
      default: return { color: 'text-muted-foreground', icon: FileText, bgColor: 'bg-muted', borderColor: 'border-border' };
    }
  };

  const progressValue = {
    initial: 33,
    questions: 66,
    results: 100
  }[step];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-6 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-hero flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">AI Symptom Checker</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get preliminary health insights by answering a few questions. This is not a substitute for professional medical advice.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {step === 'initial' && 'Step 1 of 3: Primary Symptoms'}
                {step === 'questions' && `Step 2 of 3: Clarifying Questions`}
                {step === 'results' && 'Step 3 of 3: Assessment Results'}
              </span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </CardContent>
        </Card>

        {step === 'initial' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>What are your primary symptoms?</CardTitle>
                <CardDescription>Select all that apply. You can search for symptoms as well.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search symptoms (e.g., 'fever', 'pain')"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {isLoading && <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin" /></div>}
                {!isLoading && (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {primarySymptoms.map((symptom) => {
                      const isSelected = selectedSymptoms.has(symptom.id);
                      const Icon = getSymptomIcon(symptom.name);
                      return (
                        <Card
                          key={symptom.id}
                          className={`cursor-pointer transition-all duration-200 hover:shadow-medium ${isSelected ? 'ring-2 ring-medical-primary bg-medical-primary/5' : ''}`}
                          onClick={() => handlePrimarySelect(symptom)}>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? 'bg-medical-primary text-white' : 'bg-surface-elevated'}`}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <span className="font-medium">{symptom.name}</span>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Information (Optional)</CardTitle>
                <CardDescription>Describe your symptoms in more detail. This information is not yet used in the analysis but can be helpful for a doctor.</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="When did symptoms start? How severe are they? Any other relevant details..."
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  rows={3}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button size="lg" variant="medical" onClick={startQuestioning} disabled={selectedSymptoms.size === 0}>
                Next
              </Button>
            </div>
          </div>
        )}
        
        {step === 'questions' && currentQuestion && (
             <Card>
                <CardHeader>
                  <CardTitle>{currentQuestion.question_prompt}</CardTitle>
                  <CardDescription>Please select the most accurate description.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {allSymptoms.filter(s => s.parent_symptom_id === currentQuestion.id).map(answer => (
                    <Card key={answer.id} className="cursor-pointer hover:bg-surface-elevated transition-colors" onClick={() => handleAnswerSelect(answer)}>
                      <CardContent className="p-4 font-medium">{answer.name}</CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
        )}

        {step === 'results' && (
            <div className="space-y-6">
                {isLoading && (
                    <Card>
                        <CardContent className="p-8 flex flex-col items-center gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-muted-foreground">Analyzing your symptoms...</p>
                        </CardContent>
                    </Card>
                )}
                {!isLoading && results.length > 0 && results.map((result, index) => {
                  const triage = getTriageInfo(result.condition.triage_level);
                  return (
                    <Card key={result.condition.id} className={index === 0 ? `border-2 ${triage.borderColor}` : ''}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${triage.bgColor}`}>
                              <triage.icon className={`h-5 w-5 ${triage.color}`} />
                            </div>
                            <span>{index + 1}. {result.condition.name}</span>
                          </div>
                          <Badge variant={index === 0 ? "default" : "secondary"}>{result.confidence}% Confidence</Badge>
                        </CardTitle>
                        <CardDescription>{result.condition.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-6 md:grid-cols-2">
                        <div>
                          <h4 className="font-semibold mb-3">Recommendations</h4>
                          <ul className="space-y-2">
                            {result.condition.recommendations.map((rec, i) => (
                              <li key={i} className="flex items-start gap-3 text-sm">
                                <CheckCircle className="h-4 w-4 text-medical-success mt-1 flex-shrink-0" />
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3">When to Seek Care</h4>
                          <ul className="space-y-2">
                            {result.condition.when_to_seek_care.map((warning, i) => (
                              <li key={i} className="flex items-start gap-3 text-sm">
                                <AlertTriangle className="h-4 w-4 text-medical-warning mt-1 flex-shrink-0" />
                                <span>{warning}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {!isLoading && results.length === 0 && (
                     <Card>
                        <CardContent className="p-8 text-center">
                            <h3 className="text-lg font-semibold">No Clear Match Found</h3>
                            <p className="text-muted-foreground">Our system could not find a confident match for your symptoms. It's best to consult a professional.</p>
                        </CardContent>
                     </Card>
                )}

                <Card className="border-medical-primary/30 bg-medical-primary/5">
                  <CardContent className="p-6 text-center space-y-3">
                      <h3 className="text-lg font-semibold">Need Professional Medical Advice?</h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        This assessment is for informational purposes only. Always consult a qualified healthcare professional for an accurate diagnosis and treatment plan.
                      </p>
                      <div className="flex gap-4 justify-center pt-2">
                        <Button variant="medical" asChild><a href="/consult">Book Consultation</a></Button>
                        <Button variant="destructive" asChild><a href="tel:102"><Phone className="h-4 w-4 mr-2" />Emergency Call</a></Button>
                      </div>
                  </CardContent>
                </Card>

                <div className="flex justify-center">
                    <Button variant="outline" onClick={resetChecker}>
                        <ArrowLeft className="mr-2 h-4 w-4"/> Start Over
                    </Button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default SymptomChecker;