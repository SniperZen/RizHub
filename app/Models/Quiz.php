<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'kabanata_id',
        'question',
        'choice_a',
        'choice_b',
        'choice_c',
        'correct_answer',
    ];

    /**
     * Get the kabanata that owns the quiz.
     */
    public function kabanata()
    {
        return $this->belongsTo(Kabanata::class);
    }

    /**
     * Get all quizzes for a specific kabanata.
     *
     * @param int $kabanataId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getQuizzesByKabanata($kabanataId)
    {
        return self::where('kabanata_id', $kabanataId)->get();
    }

    /**
     * Get a random quiz for a specific kabanata.
     *
     * @param int $kabanataId
     * @return \App\Models\Quiz|null
     */
    public static function getRandomQuiz($kabanataId)
    {
        return self::where('kabanata_id', $kabanataId)
                    ->inRandomOrder()
                    ->first();
    }

    /**
     * Check if the provided answer is correct.
     *
     * @param string $answer
     * @return bool
     */
    public function isCorrectAnswer($answer)
    {
        return $this->correct_answer === strtoupper($answer);
    }

    /**
     * Get the correct answer text.
     *
     * @return string
     */
    public function getCorrectAnswerText()
    {
        switch ($this->correct_answer) {
            case 'A':
                return $this->choice_a;
            case 'B':
                return $this->choice_b;
            case 'C':
                return $this->choice_c;
            default:
                return '';
        }
    }

    /**
     * Get all answer options as an array.
     *
     * @return array
     */
    public function getAnswerOptions()
    {
        return [
            'A' => $this->choice_a,
            'B' => $this->choice_b,
            'C' => $this->choice_c,
        ];
    }
}