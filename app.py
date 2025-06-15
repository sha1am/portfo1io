from flask import Flask, render_template
import json
import plotly
import plotly.graph_objs as go

app = Flask(__name__)

# Sample data for solved questions
solved_data = {
    'months': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    'leetcode': [5, 12, 20, 15, 25, 30],
    'codeforces': [3, 8, 10, 12, 18, 20]
}

recent_questions = [
    {'platform': 'LeetCode', 'title': 'Two Sum', 'date': '2024-05-01'},
    {'platform': 'LeetCode', 'title': 'Binary Tree Level Order Traversal', 'date': '2024-05-02'},
    {'platform': 'Codeforces', 'title': 'A. Theatre Square', 'date': '2024-05-03'},
    {'platform': 'LeetCode', 'title': 'Container With Most Water', 'date': '2024-05-04'},
]

links = {
    'LinkedIn': 'https://www.linkedin.com/in/sha1am',
    'GitHub': 'https://github.com/sha1am',
    'LeetCode': 'https://leetcode.com/u/sha1am/',
    'Codeforces': 'https://codeforces.com/profile/shalam',
    'StrataScratch': 'https://platform.stratascratch.com/user/sha1am'
}

@app.route('/')
def index():
    # Build Plotly graph
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=solved_data['months'], y=solved_data['leetcode'],
                             mode='lines+markers', name='LeetCode'))
    fig.add_trace(go.Scatter(x=solved_data['months'], y=solved_data['codeforces'],
                             mode='lines+markers', name='Codeforces'))
    fig.update_layout(title='Solved Questions Over Time', xaxis_title='Month',
                      yaxis_title='Questions Solved')
    graphJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
    return render_template('index.html', graphJSON=graphJSON,
                           recent_questions=recent_questions, links=links)

if __name__ == '__main__':
    app.run(debug=True)
