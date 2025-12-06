const Loader = ({text}) => {
    return (
        <div className="p-6 flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">{text}</p>
            </div>
        </div>
    );
};

export default Loader;
