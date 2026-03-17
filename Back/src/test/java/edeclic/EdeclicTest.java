package edeclic;

import com.intuit.karate.Results;
import com.intuit.karate.Runner;
import net.masterthought.cucumber.Configuration;
import net.masterthought.cucumber.ReportBuilder;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class EdeclicTest {

    @Test
    void testAll() {
        Results results = Runner.path("classpath:edeclic")
                .outputCucumberJson(true)
                .parallel(1);

        generateReport(results.getReportDir());
        assertEquals(0, results.getFailCount(), results.getErrorMessages());
    }

    static void generateReport(String karateOutputPath) {
        Collection<File> jsonFiles = new ArrayList<>();
        File reportDir = new File(karateOutputPath);
        if (reportDir.exists()) {
            for (File file : reportDir.listFiles()) {
                if (file.getName().endsWith(".json")) {
                    jsonFiles.add(file);
                }
            }
        }

        List<String> jsonPaths = new ArrayList<>();
        for (File file : jsonFiles) {
            jsonPaths.add(file.getAbsolutePath());
        }

        if (!jsonPaths.isEmpty()) {
            Configuration config = new Configuration(new File("target"), "eDeclic API Tests");
            ReportBuilder reportBuilder = new ReportBuilder(jsonPaths, config);
            reportBuilder.generateReports();
        }
    }
}
