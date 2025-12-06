from llama_index.core.tools import FunctionTool, QueryEngineTool
from llama_index.llms.ollama import Ollama
from llama_index.core.agent.workflow import AgentWorkflow
from llama_index.core.workflow import Context
from llama_index.tools.duckduckgo import DuckDuckGoSearchToolSpec
from llama_index.core import SimpleDirectoryReader
import chromadb
from llama_index.embeddings.huggingface import HuggingFaceEmbedding 
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.ingestion import IngestionPipeline
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.core import VectorStoreIndex
from typing import List, Dict, Any, Optional
import asyncio
import logging
import os



class ChatAgent:
    def __init__(self, model="qwen2.5:3b", base_url="http://127.0.0.1:11434"):
        self.model = model
        self.base_url = base_url
        self.llm = None
        self.agent = None
        self.ctx = None 
        self.query_engine = None
        self._initialize_component()

    def _initialize_component(self):
        """Initialize Component with llm and tools"""   
        print("🚀 Initializing FITNESS FLOW Assistant with LLM")

        try:
            self.llm = Ollama(
                model=self.model,
                base_url=self.base_url,
                request_timeout=120.0,
                temperature=0.2
            )
            print(f" FITNESS FLOW Assistant Initialized with {self.model}")

            self.tools = self._setup_tools()
            print(f" Tool setup completed with {len(self.tools)} tools!")

            self.agent = self._create_agent()
            self.ctx = Context(self.agent)

            print("🎯 FITNESS FLOW Assistant created successfully with all tools")
 
        except Exception as e:
            print(f"❌ ERROR during initialization: {str(e)}")
            self.agent = None

    def _setup_coach_query_tool(self):
        """
        Set up and return a query tool for gym coach data from the database.
        Returns:
            QueryEngineTool: Tool for querying coach information
        """
        try:
            print("🔄 Setting up coach database tool...")
            
            # Load coach data
            file_path = r"C:\Users\elazzaoui\Desktop\Web\Fitness Flow\BACK_END\app\agents\coachs.csv"
            
            if not os.path.exists(file_path):
                print(f"❌ Coach data file not found: {file_path}")
                return None
                
            file_reader = SimpleDirectoryReader(input_files=[file_path])
            documents = file_reader.load_data()
            
            if not documents:
                print("❌ No documents loaded from coach data file")
                return None
            
            # Initialize ChromaDB with error handling
            try:
                db = chromadb.PersistentClient(path="./chroma_db")
                chroma_collection = db.get_or_create_collection("coachs")
                vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
            except Exception as e:
                print(f"❌ ChromaDB setup failed: {e}")
                return None
            
            # Create embedding model with offline fallback
            try:
                embed_model = HuggingFaceEmbedding(
                    model_name="sentence-transformers/all-MiniLM-L6-v2",  # Smaller, more reliable model
                    trust_remote_code=True
                )
            except Exception as e:
                print(f"❌ Embedding model setup failed: {e}")
                # Fallback: Skip vector store and use simple document search
                return self._create_simple_coach_tool(documents)
            
            # Create simple index without complex pipeline
            try:
                index = VectorStoreIndex.from_documents(
                    documents,
                    embed_model=embed_model
                )
                
                # Create query engine
                self.query_engine = index.as_query_engine(llm=self.llm)
                
                # Create and return query tool
                query_tool = QueryEngineTool.from_defaults(
                    query_engine=self.query_engine,
                    name="coach_database_tool",
                    description="Useful for querying detailed information about gym coaches, their specialties, schedules, certifications, and expertise from the coach database."
                )
                
                print("✅ Coach database tool setup successfully!")
                return query_tool

            except Exception as e:
                print(f"❌ Vector store setup failed: {e}")
                return self._create_simple_coach_tool(documents)

        except Exception as e:
            print(f"❌ Error setting up coach query tool: {e}")
            return None

    def _create_simple_coach_tool(self, documents):
        """Fallback simple coach tool without vector database"""
        try:
            # Extract text from documents
            coach_data = "\n".join([doc.text for doc in documents])
            
            def simple_coach_query(query: str) -> str:
                """Simple coach information search"""
                query_lower = query.lower()
                
                # Simple keyword matching
                if any(word in query_lower for word in ['yoga', 'stretch', 'flexibility']):
                    return "Our yoga coaches specialize in various styles including Hatha, Vinyasa, and Power Yoga. They focus on flexibility, balance, and mindfulness."
                elif any(word in query_lower for word in ['weight', 'strength', 'powerlifting']):
                    return "Our strength coaches are certified in weight training, powerlifting techniques, and strength conditioning programs."
                elif any(word in query_lower for word in ['cardio', 'hiit', 'endurance']):
                    return "Cardio specialists offer HIIT, endurance training, and metabolic conditioning programs."
                elif any(word in query_lower for word in ['nutrition', 'diet', 'meal']):
                    return "Nutrition coaches provide personalized meal plans, supplementation guidance, and dietary strategies."
                else:
                    return f"Based on our coach database: {coach_data[:500]}..."
            
            return FunctionTool.from_defaults(
                fn=simple_coach_query,
                name="coach_info_tool",
                description="Useful for finding information about gym coaches, their specialties, and training expertise."
            )
            
        except Exception as e:
            print(f"❌ Simple coach tool setup failed: {e}")
            return None

    def _setup_tools(self):
        def get_master() -> str:
            """Useful for anyone asking about your master and developer."""
            return """
             **FITNESS FLOW AI Assistant** 
            
            • **Developer**: FITNESS FLOW GYM Technology Team
            • **Master/Owner**: Abdellah Elazzaoui  
            • **Purpose**: Provide intelligent fitness guidance and gym information
            I'm here to help you achieve your fitness goals! 
            """
        
        def get_gym_info(query: Optional[str] = None) -> Dict[str, Any]:
            """Useful for anyone asking about gym information like working hours, definition, address, telephone, email, etc."""
            gym_data = {
                "definition": "We have a modern and dynamic sports hall that suits your success. Premium equipment, certified coaches and motivational environment - they are all available to help you achieve your goals.",
                "working_hours": {
                    "Monday - Friday": "6:00 - 23:00",
                    "Saturday": "7:00 - 22:00",
                    "Sunday": "8:00 - 20:00",
                },
                "telephone": "+212 54332178",
                "email": "fitness.flow@gmail.com",
                "gym_owner": "Abdellah Elazzaoui",
                "address": "123 Salam, Agadir, Morocco",
                "services": [
                    "Personal Training",
                    "Group Fitness Classes",
                    "Weight Training",
                    "Cardio Equipment",
                    "Nutrition Guidance"
                ],
                "facilities": [
                    "Modern Equipment",
                    "Locker Rooms", 
                    "Showers",
                    "Supplement Shop"
                ]
            }
            
            if query:
                query_lower = query.lower()
                if any(word in query_lower for word in ['hour', 'time', 'open', 'close']):
                    return {"working_hours": gym_data["working_hours"]}
                elif any(word in query_lower for word in ['contact', 'phone', 'email', 'address']):
                    return {
                        "telephone": gym_data["telephone"],
                        "email": gym_data["email"], 
                        "address": gym_data["address"]
                    }
                elif any(word in query_lower for word in ['service', 'facility']):
                    return {
                        "services": gym_data["services"],
                        "facilities": gym_data["facilities"]
                    }
            
            return gym_data
        
        def search_web(query: str, region: str = "wt-wt", max_results: int = 5) -> List[Dict[str, str]]:
            """
            Search the web for current information using DuckDuckGo.
            
            Args:
                query: The search query string
                region: Search region in country-language format (e.g., "us-en", "uk-en")
                max_results: Maximum number of results to return (default: 5)
                
            Returns:
                List of search results with titles, URLs, and snippets
            """
            try:
                search_tool = DuckDuckGoSearchToolSpec()
                results = search_tool.duckduckgo_full_search(
                    query=query,
                    region=region,
                    max_results=max_results
                )
                
                formatted_results = []
                for result in results:
                    formatted_results.append({
                        "title": result.get("title", "No Title"),
                        "url": result.get("link", "No URL"),
                        "snippet": result.get("snippet", "No description")[:150] + "..."
                    })
                
                return formatted_results
                
            except Exception as e:
                return [{"error": f"Search failed: {str(e)}"}]
        
        # Create base tools list
        tools = [
            FunctionTool.from_defaults(
                fn=get_master,
                name="master_tool",
                description="Useful when someone asks about your creator, developer, or master. Use for questions about who made you, your owner, or development team."
            ),
            FunctionTool.from_defaults(
                fn=get_gym_info,
                name="gym_info_tool",
                description="Useful for providing comprehensive gym information including working hours, contact details, services, facilities, owner information, and gym description."
            ),
            FunctionTool.from_defaults(
                fn=search_web,
                name="web_search_tool",
                description="Search the web for current information, news, fitness trends, exercise techniques, nutrition advice, or general knowledge not specific to FITNESS FLOW gym."
            ),
        ]

        # Add coach database tool if available
        coach_db_tool = self._setup_coach_query_tool()
        if coach_db_tool:
            tools.append(coach_db_tool)
        else:
            print("Coach database tool not available, continuing with basic tools")

        return tools

    def _create_agent(self):
        system_prompt = """
            #  FITNESS FLOW GYM FITNESS ASSISTANT

            ##  YOUR ROLE
            You are the official AI assistant for FITNESS FLOW Gym in Agadir, Morocco. Your mission is to provide accurate, helpful, and motivating fitness guidance while representing our premium gym brand.

            ##  TOOL USAGE GUIDE

            ### MASTER_TOOL
            - **When to use**: Questions about creator, developer, owner, AI origins
            - **Examples**: 
            "Who made you?"
            "Tell me about your developer"
            "Who is Abdellah Elazzaoui?"

            ### GYM_INFO_TOOL
            - **When to use**: ANY gym-related information requests
            - **Examples**:
            "What are your working hours?"
            "What services do you offer?"
            "Phone number and address?"
            "Tell me about the gym facilities"

            ### COACH_DATABASE_TOOL  
            - **When to use**: Questions about trainers, coaches, specialties, schedules
            - **Examples**:
            "Do you have yoga instructors?"
            "What coaches are available?"
            "Tell me about your personal trainers"
            "Coach schedules and specialties"

            ### WEB_SEARCH_TOOL
            - **When to use**: General fitness knowledge, exercises, nutrition, health trends
            - **Examples**:
            "Best exercises for weight loss"
            "Nutrition tips for muscle gain"
            "Latest fitness trends"

            ## 💬 COMMUNICATION STYLE

            ### BE:
            - ✅ **Motivational** and **energetic**
            - ✅ **Professional** but **friendly**  
            - ✅ **Precise** and **knowledgeable**
            - ✅ **Solution-oriented**

            ### AVOID:
            - ❌ Long, boring paragraphs
            - ❌ Technical jargon without explanation
            - ❌ Guessing or making up information

            ### FORMATTING:
            - Use emojis to make responses engaging 🏋️‍♂️💪🎯
            - Break information into clear sections
            - Provide actionable advice
            - Always offer next steps

            ## 🚀 KEY PRINCIPLES

            1. **ALWAYS USE TOOLS** for factual information - never guess!
            2. **BE PROACTIVE** in offering help and suggestions
            3. **STAY POSITIVE** and motivational in all responses
            4. **PROVIDE ACCURATE** information about FITNESS FLOW
            5. **USE SEARCH TOOL** for general fitness knowledge

            ## 📞 CONTACT INFORMATION
            Always guide users to contact us for complex queries:
            - 📞 **Phone**: +212 54332178
            - 📧 **Email**: fitness.flow@gmail.com
            - 📍 **Address**: 123 Salam, Agadir, Morocco

            ## 🎯 SUCCESS FORMULA
            Help users by:
            1. Understanding their fitness goals
            2. Providing accurate information using tools
            3. Motivating them to take action
            4. Guiding them to the right resources

            Remember: You are the face of FITNESS FLOW Gym - be professional, knowledgeable, and inspiring! 
        """

        return AgentWorkflow.from_tools_or_functions(
            self.tools,
            llm=self.llm,
            system_prompt=system_prompt
        )
    
    async def chat(self, message: str):
        try:
            print(f"User: {message}")
            if not self.agent:
                return "FITNESS FLOW Assistant is not properly initialized. Please contact us at +212 54332178"
            
            agent_output = await self.agent.run(message, ctx=self.ctx)
            response = str(agent_output)
            print(f"Assistant: {response[:100]}...")
            return response

        except Exception as e:
            print(f"Error: {str(e)}")
            return f"I encountered an issue. Please contact FITNESS FLOW directly at +212 54332178 for immediate assistance."


# Create global agent instance
agent = ChatAgent()